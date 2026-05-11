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

  @Column({ type: 'int', default: 0, comment: 'Total team HeartCoin balance' })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  memberCount: number;

  @Column({ type: 'int', default: 0 })
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'leader_id' })
  leader: User;

  @Column({ type: 'uuid', nullable: false, name: 'leader_id' })
  leaderId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  teamId: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 20, default: TeamRole.MEMBER })
  role: TeamRole;

  @Column({ type: 'int', default: 0, comment: 'Points contributed to this team' })
  contributedPoints: number;

  @Column({ type: 'int', default: 0, comment: 'Tasks completed in this team' })
  completedTasks: number;

  @CreateDateColumn({ type: 'timestamp' })
  joinedAt: Date;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
