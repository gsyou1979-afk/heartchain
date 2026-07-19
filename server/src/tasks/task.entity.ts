import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type TaskStatus = 'open' | 'accepted' | 'completed' | 'cancelled';

@Entity('hc_tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  category: string; // errand/transport/teach/pet/repair/delivery

  @Column({ length: 50, default: 'open' })
  status: TaskStatus;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ length: 300, nullable: true })
  address: string;

  // ─── 신규 보상 체계 ─────────────────────────────────────
  @Column({ type: 'integer', default: 0 })
  baseReward: number; // 플랫폼 산정 기본 보상 (任务生成积分)

  @Column({ type: 'integer', default: 0 })
  publisherReward: number; // 발행인 보상 (发布人奖励积分, 완료 시 지급)

  @Column({ type: 'integer', default: 0 })
  bonusReward: number; // 발행인 추가 보상 (선택)

  // (기존 reward_amount / reward_points / accept_points 는 하위 호환용으로 유지)
  @Column({ type: 'integer', default: 0 })
  reward_amount: number;

  @Column({ type: 'integer', default: 0 })
  reward_points: number;

  @Column({ type: 'boolean', default: false })
  accept_points: boolean;

  @Column({ type: 'boolean', default: false })
  anonymous: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  educationLevel: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 1 })
  estimatedHours: number;

  @Column({ type: 'integer', default: 1 })
  requiredCreditScore: number;

  @Column({ type: 'integer', default: 0 })
  requiredExperience: number;

  @Column({ type: 'boolean', default: false })
  bonusReserved: boolean; // 추가 보상 동결 여부

  @Column({ nullable: true })
  creator_id: number;

  @Column({ nullable: true })
  helper_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
