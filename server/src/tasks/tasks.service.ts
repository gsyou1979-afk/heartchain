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
    const { baseReward } = this.evaluationService.evaluate(evalInput);

    const bonusPoints = dto.bonusPoints ?? 0;

    if (bonusPoints > 0) {
      const ok = await this.walletService.reserve(
        dto.creator_id,
        bonusPoints,
        `task_bonus_${dto.title}`,
      );
      if (!ok) {
        throw new BadRequestException('잔고가 부족하여 추가 보상을 동결할 수 없습니다.');
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
      bonusReward: bonusPoints,
      bonusReserved: bonusPoints > 0,
      creator_id: dto.creator_id,
    });

    return this.taskRepo.save(task);
  }

  async complete(taskId: number, helperId: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('작업을 찾을 수 없습니다.');
    if (task.status !== 'accepted') {
      throw new BadRequestException('진행 중인 작업만 완료 처리할 수 있습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.transactionsService.mint(
        helperId,
        task.baseReward,
        `task_${task.id}_base`,
        `작업 완료 기본 보상: ${task.title}`,
        queryRunner,
      );

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
          `작업 완료 추가 보상: ${task.title}`,
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
    if (!task) throw new NotFoundException('작업을 찾을 수 없습니다.');
    if (task.status !== 'open' && task.status !== 'accepted') {
      throw new BadRequestException('취소할 수 없는 상태입니다.');
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
        `작업 취소 ? 추가 보상 반환: ${task.title}`,
      );
    }

    task.status = 'cancelled';
    task.bonusReserved = false;
    return this.taskRepo.save(task);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('작업을 찾을 수 없습니다.');
    return task;
  }

  async findByCreator(creatorId: number): Promise<Task[]> {
    return this.taskRepo.find({ where: { creator_id: creatorId } });
  }
}
