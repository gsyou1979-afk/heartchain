import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  VOLUNTEER = 'volunteer',
  ORGANIZATION = 'organization',
  SKILL_PROVIDER = 'skill_provider',
  DONOR = 'donor',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('hc_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  name: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  password_hash: string;

  // auth module fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 20, default: UserRole.VOLUNTEER })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bio: string;

  @Column({ type: 'simple-json', nullable: true })
  skills: string[];

  @Column({ type: 'simple-json', nullable: true })
  education: { level: string; school: string; year: string }[];

  @Column({ type: 'boolean', default: false })
  phoneVerified: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  language: string;

  // legacy fields
  @Column({ type: 'integer', default: 0 })
  balance: number;

  @Column({ type: 'integer', default: 0 })
  reservedBalance: number;

  @Column({ type: 'integer', default: 0 })
  totalPoints: number;

  @Column({ type: 'float', default: 0 })
  pointBalance: number;

  @Column({ type: 'integer', default: 1 })
  level: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  creditScore: number;

  @Column({ type: 'integer', default: 0 })
  helpCount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt: Date;
}
