import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { EvaluationService, EvaluationInput } from '../evaluation/evaluation.service';
import { WalletService } from '../wallet/wallet.service';
import { TransactionsService } from '../transactions/transactions.service';

export interface CreateTaskDto {
  title: string;
  description?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  anonymous?: boolean;
  deadline?: Date;
  educationLevel?: string;
  estimatedHours: number;
  requiredCreditScore?: number;
  requiredExperience?: number;
  bonusPoints?: number;
  creator_id: number;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly evaluationService: EvaluationService,
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepo.find();
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const evalInput: EvaluationInput = {
      category: dto.category,
      educationLevel: dto.educationLevel,
      estimatedHours: dto.estimatedHours,
      requiredCreditScore: dto.requiredCreditScore ?? 1,
      requiredExperience: dto.requiredExperience ?? 0,
    };
    const { baseReward, publisherReward } = this.evaluationService.evaluate(evalInput);

    const bonusPoints = dto.bonusPoints ?? 0;

    if (bonusPoints > 0) {
      const ok = await this.walletService.reserve(
        dto.creator_id,
        bonusPoints,
        `task_bonus_${dto.title}`,
      );
      if (!ok) {
        throw new BadRequestException('余额不足，无法冻结额外奖励。');
      }
    }

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      latitude: dto.latitude,
      longitude: dto.longitude,
      address: dto.address,
      anonymous: dto.anonymous ?? false,
      deadline: dto.deadline,
      educationLevel: dto.educationLevel,
      estimatedHours: dto.estimatedHours,
      requiredCreditScore: dto.requiredCreditScore ?? 1,
      requiredExperience: dto.requiredExperience ?? 0,
      baseReward,
      publisherReward,
      bonusReward: bonusPoints,
      bonusReserved: bonusPoints > 0,
      creator_id: dto.creator_id,
    });

    return this.taskRepo.save(task);
  }

  async complete(taskId: number, helperId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('找不到任务。');
    if (task.status !== 'accepted') {
      throw new BadRequestException('只能完成进行中的任务。');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 任务生成积分 → 完成者获得基础奖励（平台铸造）
      await this.transactionsService.mint(
        helperId,
        task.baseReward,
        `task_${task.id}_base`,
        `任务完成基础奖励: ${task.title}`,
        queryRunner,
      );

      // 2. 发布人奖励积分 → 发布人获得奖励（平台铸造）
      if (task.publisherReward > 0) {
        await this.transactionsService.mint(
          task.creator_id,
          task.publisherReward,
          `task_${task.id}_publisher`,
          `发布人奖励: ${task.title}`,
          queryRunner,
          'publisher_reward',
        );
      }

      // 3. 额外奖励 → 从发布人冻结余额转给完成者
      if (task.bonusReward > 0 && task.bonusReserved) {
        await this.walletService.releaseReserve(
          task.creator_id,
          task.bonusReward,
          `task_bonus_${task.title}`,
        );
        await this.transactionsService.transfer(
          task.creator_id,
          helperId,
          task.bonusReward,
          `task_${task.id}_bonus`,
          `额外奖励: ${task.title}`,
          queryRunner,
        );
      }

      task.status = 'completed';
      task.helper_id = helperId;
      await queryRunner.manager.save(task);

      await queryRunner.commitTransaction();
      return task;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(taskId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('找不到任务。');
    if (task.status !== 'open' && task.status !== 'accepted') {
      throw new BadRequestException('无法取消的状态。');
    }

    if (task.bonusReward > 0 && task.bonusReserved) {
      await this.walletService.releaseReserve(
        task.creator_id,
        task.bonusReward,
        `task_bonus_${task.title}`,
      );
      await this.transactionsService.refund(
        task.creator_id,
        task.bonusReward,
        `task_${task.id}_refund`,
        `任务取消 - 额外奖励退还: ${task.title}`,
      );
    }

    task.status = 'cancelled';
    task.bonusReserved = false;
    return this.taskRepo.save(task);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('找不到任务。');
    return task;
  }

  async findByCreator(creatorId: number): Promise<Task[]> {
    return this.taskRepo.find({ where: { creator_id: creatorId } });
  }
}
