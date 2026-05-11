import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum TagCategory {
  GEO = 'geo',
  INTEREST = 'interest',
  BEHAVIOR = 'behavior',
  DEVICE = 'device',
  SERVICE_EXPERIENCE = 'service_experience',
}

export enum TagSource {
  REGISTRATION = 'registration',
  INFERRED = 'inferred',
  THIRD_PARTY = 'third_party',
}

@Entity('user_tags')
@Index(['userId', 'tagKey', 'tagValue'])
export class UserTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  tagCategory: TagCategory;

  @Column({ type: 'varchar', length: 100, nullable: false })
  tagKey: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  tagValue: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: '1.0' })
  confidence: number;

  @Column({ type: 'varchar', length: 30, default: TagSource.INFERRED })
  source: TagSource;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
