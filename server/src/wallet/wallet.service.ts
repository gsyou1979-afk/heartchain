import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getWallet(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'name', 'balance', 'reservedBalance', 'totalPoints'],
    });
    return {
      userId: user.id,
      name: user.name,
      balance: user.balance,
      reservedBalance: user.reservedBalance,
      availableBalance: user.balance - user.reservedBalance,
      totalPoints: user.totalPoints,
    };
  }

  /** 추가 보상 동결: 잔고에서 차감하여 reservedBalance로 이동 */
  async reserve(
    userId: number,
    amount: number,
    reference: string,
  ): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.balance < amount) return false;

    user.balance -= amount;
    user.reservedBalance += amount;
    await this.userRepo.save(user);
    return true;
  }

  /** 동결 해제: reservedBalance → balance */
  async releaseReserve(
    userId: number,
    amount: number,
    reference: string,
  ): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('사용자를 찾을 수 없습니다.');
    if (user.reservedBalance < amount) {
      throw new BadRequestException('동결 잔고가 부족합니다.');
    }
    user.balance += amount;
    user.reservedBalance -= amount;
    await this.userRepo.save(user);
  }
}
