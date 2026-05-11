import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdCampaign } from '../../ad-campaign/entities/ad-campaign.entity';

export enum CreativeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum CreativeType {
  IMAGE = 'image',
  VIDEO = 'video',
  RICH = 'rich',
  NATIVE = 'native',
}

@Entity('ad_creatives')
export class AdCreative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  campaignId: string;

  @ManyToOne(() => AdCampaign)
  @JoinColumn({ name: 'campaignId' })
  campaign: AdCampaign;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  landingUrl: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  creativeType: CreativeType;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'varchar', length: 20, default: CreativeStatus.PENDING })
  status: CreativeStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
