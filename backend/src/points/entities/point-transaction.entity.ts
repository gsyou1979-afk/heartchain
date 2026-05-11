import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PointTransactionType {
  TASK_REWARD = 'task_reward',           // 任务完成奖励
  TASK_STAKE = 'task_stake',             // 发布任务质押
  TRANSFER = 'transfer',                 // 用户间转账
  DONATION = 'donation',                 // 捐赠
  DONATION_RECEIVE = 'donation_receive', // 收到捐赠
  TEAM_REWARD = 'team_reward',           // 团队奖励
  REFUND = 'refund',                     // 退款
  ADMIN_ADJUST = 'admin_adjust',         // 管理员调整
}

export enum PointTransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ON_CHAIN = 'on_chain',                 // 已上链
  REVERSED = 'reversed',
}

@Entity('point_transactions')
export class PointTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: PointTransactionType;

  @Column({ type: 'varchar', length: 20, default: PointTransactionStatus.PENDING })
  status: PointTransactionStatus;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'text', nullable: true, comment: 'Transaction description' })
  description: string;

  @Column({ type: 'uuid', nullable: false, name: 'from_user_id', comment: 'Sender user ID, null for system' })
  fromUserId: string;

  @Column({ type: 'uuid', nullable: false, name: 'to_user_id', comment: 'Receiver user ID' })
  toUserId: string;

  @Column({ type: 'uuid', nullable: true, name: 'task_id', comment: 'Related task ID' })
  taskId: string;

  @Column({ type: 'uuid', nullable: true, name: 'donation_id', comment: 'Related donation ID' })
  donationId: string;

  @Column({ type: 'uuid', nullable: true, name: 'team_id', comment: 'Related team ID' })
  teamId: string;

  // Blockchain info
  @Column({ type: 'varchar', length: 66, nullable: true, name: 'tx_hash', comment: 'On-chain transaction hash' })
  txHash: string;

  @Column({ type: 'int', nullable: true, name: 'block_number', comment: 'On-chain block number' })
  blockNumber: number;

  // Triple endorsement for task reward
  @Column({ type: 'simple-json', nullable: true, comment: 'Endorsement chain' })
  endorsements: {
    workerId: string;
    workerConfirmed: boolean;
    workerConfirmedAt: Date;
    proofs: { type: string; url: string; timestamp: Date }[];
    endorserIds: string[];
    endorsers: {
      userId: string;
      confirmed: boolean;
      confirmedAt: Date;
      comment: string;
    }[];
    requesterId: string;
    requesterConfirmed: boolean;
    requesterConfirmedAt: Date;
    requesterRating: number;
    requesterComment: string;
  };

  @Column({ type: 'float', default: 0, name: 'from_user_balance', comment: 'Sender balance after tx' })
  fromUserBalance: number;

  @Column({ type: 'float', default: 0, name: 'to_user_balance', comment: 'Receiver balance after tx' })
  toUserBalance: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
