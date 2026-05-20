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

  @ManyToOne(() => AdCampaign, { nullable: true, onDelete: 'CASCADE' })
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

  @Column({ type: 'integer', nullable: true })
  width: number;

  @Column({ type: 'integer', nullable: true })
  height: number;

  @Column({ type: 'varchar', length: 20, default: CreativeStatus.PENDING })
  status: CreativeStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  get campaignId(): string | undefined {
    // First try the loaded relation, then fall back to the raw column value
    if (this.campaign?.id) return this.campaign.id;
    // Access the raw column value that TypeORM sets via @JoinColumn
    return (this as any).campaignId ?? undefined;
  }
}
