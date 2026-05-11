import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AdTypeEnum {
  COMMERCIAL = 'commercial',
  PUBLIC_SERVICE = 'public_service',
  PROJECT = 'project',
}

@Entity('ad_impressions')
@Index(['placementCode', 'createdAt'])
@Index(['userId', 'createdAt'])
export class AdImpression {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: false })
  adType: AdTypeEnum;

  @Column({ type: 'uuid', nullable: true })
  creativeId: string;

  @Column({ type: 'uuid', nullable: true })
  projectAdId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  placementCode: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  deviceId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  geoCity: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  geoSchool: string;

  @Column({ type: 'boolean', default: false })
  isViewable: boolean;

  @Column({ type: 'integer', default: 0 })
  viewDuration: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  source: string; // direct / rtb / adsense / project_auto

  @Column({ type: 'varchar', length: 50, nullable: true })
  dspId: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  bidPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  winPrice: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
