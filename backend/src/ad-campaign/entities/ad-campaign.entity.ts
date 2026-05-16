import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdType {
  COMMERCIAL = 'commercial',
  PUBLIC_SERVICE = 'public_service',
  RECRUITMENT = 'recruitment',
  SCHOOL = 'school',
  PROJECT = 'project',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum PricingModel {
  CPM = 'cpm',
  CPC = 'cpc',
  CPD = 'cpd',
}

@Entity('ad_campaigns')
export class AdCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  advertiserId: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, default: AdType.COMMERCIAL })
  adType: AdType;

  @Column({ type: 'varchar', length: 20, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Column({ type: 'varchar', length: 10, nullable: false })
  pricingModel: PricingModel;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budgetDaily: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budgetTotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: '0' })
  spent: number;

  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'json', nullable: true })
  targeting: {
    geo?: { countries?: string[]; provinces?: string[]; cities?: string[]; schools?: string[] };
    interests?: string[];
    ageGroups?: string[];
    frequency?: { daily?: number; weekly?: number; monthly?: number };
    schedule?: { hours?: number[]; daysOfWeek?: number[] };
  };

  @Column({ type: 'simple-json', nullable: true })
  placements: string[];

  /** 主图URL（base64或外部URL），方便在管理列表展示 */
  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  /** 默认跳转链接 */
  @Column({ type: 'varchar', length: 1000, nullable: true })
  landingUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
