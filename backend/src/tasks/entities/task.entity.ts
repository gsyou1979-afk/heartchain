import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskType {
  SINGLE_ONCE = 'single_once',
  SINGLE_MULTI = 'single_multi',
  TEAM_ONCE = 'team_once',
  TEAM_MULTI = 'team_multi',
}

export enum TaskStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

// 技能积分映射（与前端同步）
export const SKILL_POINTS_MAP: Record<string, number> = {
  medical: 50,
  legal: 40,
  teaching: 30,
  tech: 35,
  design: 25,
  translation: 20,
  driving: 25,
  cooking: 20,
  cleaning: 15,
  repair: 30,
  security: 20,
  elderly_care: 30,
  childcare: 25,
  event: 25,
  media: 20,
};

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  taskType: string;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: string;

  @Column({ type: 'text', nullable: true, name: 'requiredskills' })
  requiredSkills: any;

  @Column({ type: 'text', nullable: true, name: 'location_text' })
  location: string;

  // Schedule stored as text for flexibility
  @Column({ type: 'text', nullable: true })
  schedule: any;

  @Column({ type: 'integer', default: 0, comment: 'HeartCoin reward' })
  pointsReward: number;

  @Column({ type: 'integer', default: 1, comment: 'Number of volunteers needed' })
  volunteerCount: number;

  @Column({ type: 'integer', default: 1, nullable: true, name: 'teamsize', comment: 'Team task size' })
  teamSize: number;

  @Column({ type: 'integer', default: 0, name: 'currentparticipants', comment: 'Current participants count' })
  currentParticipants: number;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Region: cn / kr / global' })
  region: string;

  // Relations
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'publisher_id' })
  publisher: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ type: 'integer', default: 0 })
  viewCount: number;

  @Column({ type: 'json', nullable: true, comment: 'Proof evidence items' })
  proofEvidence: { type: 'image' | 'location' | 'description'; url?: string; text?: string; timestamp?: string }[];

  @Column({ type: 'integer', default: 0 })
  proofsSubmitted: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  set publisherId(val: string) {
    if (!this.publisher) this.publisher = new User();
    this.publisher.id = val;
  }

  get publisherId(): string {
    return this.publisher?.id;
  }

  set assigneeId(val: string | undefined) {
    if (val === undefined || val === null) {
      this.assignee = null;
    } else {
      if (!this.assignee) this.assignee = new User();
      this.assignee.id = val;
    }
  }

  get assigneeId(): string | undefined {
    return this.assignee?.id;
  }
}
