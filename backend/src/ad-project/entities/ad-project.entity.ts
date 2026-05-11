import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectAdUrgency {
  NORMAL = 'normal',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export enum ProjectAdStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('project_ads')
export class ProjectAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  taskId: string;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 1000 })
  landingUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  applicantName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  applicantAvatar: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: '0' })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: '0' })
  raisedAmount: number;

  @Column({ type: 'simple-json', nullable: true })
  geoTarget: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  };

  @Column({ type: 'simple-json', nullable: true })
  interestTarget: string[];

  @Column({ type: 'varchar', length: 10, default: ProjectAdUrgency.NORMAL })
  urgency: ProjectAdUrgency;

  @Column({ type: 'integer', default: 1 })
  urgencyLevel: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: '0' })
  priorityScore: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0' })
  dailyBudget: number;

  @Column({ type: 'integer', default: 10000 })
  quotaTotal: number;

  @Column({ type: 'integer', default: 0 })
  quotaUsed: number;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'varchar', length: 20, default: ProjectAdStatus.PENDING })
  status: ProjectAdStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  get quotaRemaining(): number {
    return this.quotaTotal - this.quotaUsed;
  }

  get progressRate(): number {
    if (!this.targetAmount || this.targetAmount === 0) return 0;
    return Math.min(1, this.raisedAmount / this.targetAmount);
  }
}
