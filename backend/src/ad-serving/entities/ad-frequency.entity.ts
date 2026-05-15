import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('ad_frequencies')
@Index(['userId', 'date'])
@Index(['creativeId', 'date'])
export class AdFrequency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  adType: string;

  @Column({ type: 'uuid', nullable: true })
  creativeId: string;

  @Column({ type: 'uuid', nullable: true })
  campaignId: string;

  @Column({ type: 'uuid', nullable: true })
  projectAdId: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;
}
