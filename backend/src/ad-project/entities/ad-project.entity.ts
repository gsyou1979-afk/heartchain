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
  PENDING = 'pending',    // 待审核
  ACTIVE = 'active',      // 投放中
  PAUSED = 'paused',      // 暂停
  COMPLETED = 'completed', // 完成
  REJECTED = 'rejected',  // 已拒绝
}

@Entity('project_ads')
export class ProjectAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** 关联的求助任务ID */
  @Column({ type: 'varchar', nullable: true })
  taskId: string;

  /** 关联的项目ID（也可等同 taskId）*/
  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  // ── 展示内容 ────────────────────────────────────────────
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 1000 })
  landingUrl: string;

  /** 申请人姓名 */
  @Column({ type: 'varchar', length: 100, nullable: true })
  applicantName: string;

  /** 申请人头像 */
  @Column({ type: 'varchar', length: 500, nullable: true })
  applicantAvatar: string;

  // ── 资金进度 ────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  raisedAmount: number;

  // ── 定向投放 ────────────────────────────────────────────
  @Column({ type: 'json', nullable: true })
  geoTarget: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  };

  @Column({ type: 'simple-array', nullable: true })
  interestTarget: string[];

  // ── 优先级 / 紧急度 ──────────────────────────────────────
  /** 紧急度枚举 */
  @Column({ type: 'varchar', length: 10, default: ProjectAdUrgency.NORMAL })
  urgency: ProjectAdUrgency;

  /** 紧急度数值 1-5（用于排序计算）*/
  @Column({ type: 'int', default: 1 })
  urgencyLevel: number;

  /** 综合优先级分数 0-100 */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  priorityScore: number;

  // ── 投放计划 ────────────────────────────────────────────
  @Column({ type: 'datetime', nullable: true })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  /** 日预算（0 = 项目广告免费）*/
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  dailyBudget: number;

  // ── 配额 ────────────────────────────────────────────────
  @Column({ type: 'int', default: 10000 })
  quotaTotal: number;

  @Column({ type: 'int', default: 0 })
  quotaUsed: number;

  // ── 统计 ────────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  impressions: number;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', default: 0 })
  conversions: number;

  // ── 状态 ────────────────────────────────────────────────
  @Column({ type: 'varchar', length: 20, default: ProjectAdStatus.PENDING })
  status: ProjectAdStatus;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  // ── 计算属性 ─────────────────────────────────────────────
  get quotaRemaining(): number {
    return this.quotaTotal - this.quotaUsed;
  }

  get progressRate(): number {
    if (!this.targetAmount || this.targetAmount === 0) return 0;
    return Math.min(1, this.raisedAmount / this.targetAmount);
  }
}
