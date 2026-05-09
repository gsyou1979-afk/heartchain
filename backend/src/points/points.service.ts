import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan, MoreThan } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  PointTransactionType,
  PointTransactionStatus,
} from './entities/point-transaction.entity';
import { TransferPointsDto, QueryTransactionDto } from './dto/point.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointTransaction)
    private txRepository: Repository<PointTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  /**
   * Mint points for task completion (triple endorsement flow)
   * This is the core patent-pending mechanism
   */
  async mintForTask(params: {
    taskId: string;
    workerId: string;
    requesterId: string;
    amount: number;
    endorsements: any;
  }): Promise<PointTransaction> {
    return this.dataSource.transaction(async (manager) => {
      // Check worker exists
      const worker = await manager.findOne(User, { where: { id: params.workerId } });
      if (!worker) throw new NotFoundException('Worker not found');

      // Create transaction record
      const tx = manager.create(PointTransaction, {
        type: PointTransactionType.TASK_REWARD,
        status: PointTransactionStatus.CONFIRMED,
        amount: params.amount,
        description: `Task reward for completing task ${params.taskId}`,
        fromUserId: 'SYSTEM',
        toUserId: params.workerId,
        taskId: params.taskId,
        endorsements: params.endorsements,
      });

      // Update worker balance
      worker.pointBalance = Number(worker.pointBalance) + params.amount;
      tx.toUserBalance = worker.pointBalance;
      tx.fromUserBalance = 0; // System has unlimited balance

      await manager.save(worker);
      return manager.save(tx);
    });
  }

  /**
   * Transfer points between users
   */
  async transfer(fromUserId: string, dto: TransferPointsDto): Promise<PointTransaction> {
    return this.dataSource.transaction(async (manager) => {
      if (fromUserId === dto.toUserId) {
        throw new BadRequestException('Cannot transfer to yourself');
      }

      const sender = await manager.findOne(User, { where: { id: fromUserId } });
      const receiver = await manager.findOne(User, { where: { id: dto.toUserId } });

      if (!sender) throw new NotFoundException('Sender not found');
      if (!receiver) throw new NotFoundException('Receiver not found');

      if (Number(sender.pointBalance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const tx = manager.create(PointTransaction, {
        type: PointTransactionType.TRANSFER,
        status: PointTransactionStatus.CONFIRMED,
        amount: dto.amount,
        description: dto.description || 'Point transfer',
        fromUserId,
        toUserId: dto.toUserId,
      });

      sender.pointBalance = Number(sender.pointBalance) - dto.amount;
      receiver.pointBalance = Number(receiver.pointBalance) + dto.amount;

      tx.fromUserBalance = sender.pointBalance;
      tx.toUserBalance = receiver.pointBalance;

      await manager.save(sender);
      await manager.save(receiver);
      return manager.save(tx);
    });
  }

  /**
   * Stake points when publishing a task
   */
  async stakeForTask(userId: string, taskId: string, amount: number): Promise<PointTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (Number(user.pointBalance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const tx = manager.create(PointTransaction, {
        type: PointTransactionType.TASK_STAKE,
        status: PointTransactionStatus.CONFIRMED,
        amount,
        description: `Task stake for task ${taskId}`,
        fromUserId: userId,
        toUserId: 'SYSTEM',
        taskId,
      });

      user.pointBalance = Number(user.pointBalance) - amount;
      tx.fromUserBalance = user.pointBalance;
      tx.toUserBalance = 0;

      await manager.save(user);
      return manager.save(tx);
    });
  }

  /**
   * Refund staked points when task is cancelled
   */
  async refund(userId: string, taskId: string, amount: number): Promise<PointTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      const tx = manager.create(PointTransaction, {
        type: PointTransactionType.REFUND,
        status: PointTransactionStatus.CONFIRMED,
        amount,
        description: `Refund for cancelled task ${taskId}`,
        fromUserId: 'SYSTEM',
        toUserId: userId,
        taskId,
      });

      user.pointBalance = Number(user.pointBalance) + amount;
      tx.toUserBalance = user.pointBalance;
      tx.fromUserBalance = 0;

      await manager.save(user);
      return manager.save(tx);
    });
  }

  /**
   * Get transaction history
   */
  async getTransactions(userId: string, dto: QueryTransactionDto) {
    const { page = 1, limit = 20, type, startDate, endDate } = dto;

    const where: any = [];

    // Show transactions where user is sender OR receiver
    where.push({ fromUserId: userId });
    where.push({ toUserId: userId });

    const [items, total] = await this.txRepository.findAndCount({
      where: where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get user balance
   */
  async getBalance(userId: string): Promise<{ balance: number; walletAddress: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['pointBalance', 'walletAddress'],
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      balance: Number(user.pointBalance),
      walletAddress: user.walletAddress,
    };
  }
}
