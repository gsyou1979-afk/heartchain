import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  // ─── 민팅 (플랫폼 → 사용자) ──────────────────────────────
  // type 기본값 'mint' (任务生成积分), 'publisher_reward' (发布人奖励积分) 등 지정 가능
  async mint(
    userId: number,
    amount: number,
    reference: string,
    description: string,
    queryRunner?: QueryRunner,
    type: TransactionType = 'mint',
  ): Promise<Transaction> {
    // 사용자 잔고 증가
    const manager = queryRunner?.manager ?? this.txRepo.manager;
    await manager.increment(User, { id: userId }, 'balance', amount);
    await manager.increment(User, { id: userId }, 'totalPoints', amount);

    const tx = manager.create(Transaction, {
      user_id: userId,
      type,
      amount,
      points: amount,
      reference,
      description,
      status: 'completed',
    });
    return manager.save(tx);
  }

  // ─── 이체 (발행인 → 완수자) ───────────────────────────────
  async transfer(
    fromUserId: number,
    toUserId: number,
    amount: number,
    reference: string,
    description: string,
    queryRunner?: QueryRunner,
  ): Promise<Transaction> {
    const manager = queryRunner?.manager ?? this.txRepo.manager;

    // 보낸 사람 잔고 감소
    const fromUser = await manager.findOne(User, { where: { id: fromUserId } });
    if (!fromUser || fromUser.balance < amount) {
      throw new BadRequestException('잔고가 부족합니다.');
    }
    await manager.decrement(User, { id: fromUserId }, 'balance', amount);

    // 받은 사람 잔고 증가
    await manager.increment(User, { id: toUserId }, 'balance', amount);
    await manager.increment(User, { id: toUserId }, 'totalPoints', amount);

    const tx = manager.create(Transaction, {
      user_id: toUserId,
      type: 'transfer',
      amount,
      points: amount,
      reference,
      related_user_id: fromUserId,
      description,
      status: 'completed',
    });
    return manager.save(tx);
  }

  // ─── 환불 (작업 취소 시) ──────────────────────────────────
  async refund(
    userId: number,
    amount: number,
    reference: string,
    description: string,
  ): Promise<Transaction> {
    await this.txRepo.manager.increment(User, { id: userId }, 'balance', amount);
    await this.txRepo.manager.decrement(User, { id: userId }, 'reservedBalance', amount);

    const tx = this.txRepo.create({
      user_id: userId,
      type: 'refund',
      amount,
      points: amount,
      reference,
      description,
      status: 'completed',
    });
    return this.txRepo.save(tx);
  }

  // ─── 거래 내역 조회 ──────────────────────────────────────
  async findByUser(userId: number, limit: number = 20): Promise<Transaction[]> {
    return this.txRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
