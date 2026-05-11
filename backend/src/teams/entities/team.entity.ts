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

export enum TeamRole {
  LEADER = 'leader',
  MEMBER = 'member',
  ADMIN = 'admin',
}

export enum TeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISSOLVED = 'dissolved',
}

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Organization type: university, community, company, ngo' })
  orgType: string;

  @Column({ type: 'varchar', length: 20, default: TeamStatus.ACTIVE })
  status: TeamStatus;

  @Column({ type: 'integer', default: 0, comment: 'Total team HeartCoin balance' })
  totalPoints: number;

  @Column({ type: 'integer', default: 0 })
  memberCount: number;

  @Column({ type: 'integer', default: 0 })
  taskCount: number;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Region: cn / kr / global' })
  region: string;

  @Column({ type: 'simple-json', nullable: true })
  location: {
    city: string;
    address: string;
  };

  @Column({ type: 'varchar', length: 20, nullable: true })
  inviteCode: string;

  @Column({ type: 'boolean', default: false, comment: 'Is verified organization' })
  isVerified: boolean;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  set leaderId(val: string) {
    if (!this.leader) this.leader = new User();
    this.leader.id = val;
  }

  get leaderId(): string {
    return this.leader?.id;
  }
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 20, default: TeamRole.MEMBER })
  role: TeamRole;

  @Column({ type: 'integer', default: 0, comment: 'Points contributed to this team' })
  contributedPoints: number;

  @Column({ type: 'integer', default: 0, comment: 'Tasks completed in this team' })
  completedTasks: number;

  @CreateDateColumn({ type: 'timestamp' })
  joinedAt: Date;

  set teamId(val: string) {
    if (!this.team) this.team = new Team();
    this.team.id = val;
  }

  get teamId(): string {
    return this.team?.id;
  }

  set userId(val: string) {
    if (!this.user) this.user = new User();
    this.user.id = val;
  }

  get userId(): string {
    return this.user?.id;
  }
}
