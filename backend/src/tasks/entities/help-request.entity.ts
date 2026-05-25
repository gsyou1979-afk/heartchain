import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum HelpType {
  ERRAND = 'errand',
  TRANSPORT = 'transport',
  TEACH = 'teach',
  PET = 'pet',
  REPAIR = 'repair',
  DELIVERY = 'delivery',
}

export enum HelpStatus {
  OPEN = 'open',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('help_requests')
export class HelpRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20 })
  type: HelpType | string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: HelpStatus | string;

  // GPS 位置
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @Index()
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @Index()
  longitude: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  address: string;

  // 时间要求（小时）
  @Column({ type: 'float', default: 2 })
  deadlineHours: number;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  // 报酬
  @Column({ type: 'integer', default: 0 })
  rewardAmount: number;

  @Column({ type: 'integer', default: 100 })
  pointsReward: number;

  @Column({ type: 'boolean', default: false })
  acceptPoints: boolean;

  // 匿名
  @Column({ type: 'boolean', default: false })
  anonymous: boolean;

  // 图片（JSON数组）
  @Column({ type: 'json', nullable: true })
  images: string[];

  // 求助者
  @Column({ type: 'uuid', name: 'creator_id' })
  creatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  // 帮助者
  @Column({ type: 'uuid', nullable: true, name: 'helper_id' })
  helperId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'helper_id' })
  helper: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
