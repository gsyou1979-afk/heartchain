import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectAd } from '../../ad-project/entities/ad-project.entity';

export enum ConversionType {
  DONATION = 'donation',
  SIGNUP = 'signup',
  SHARE = 'share',
  VIEW_DETAIL = 'view_detail',
  CONTACT = 'contact',
}

@Entity('project_ad_conversions')
@Index(['projectAdId', 'createdAt'])
@Index(['userId', 'createdAt'])
export class ProjectAdConversion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  impressionId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  clickId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userId: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: ConversionType.VIEW_DETAIL,
  })
  conversionType: ConversionType;

  @Column({ type: 'varchar', length: 200, nullable: true })
  conversionValue: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => ProjectAd, { nullable: true })
  @JoinColumn({ name: 'projectAdId' })
  projectAd: ProjectAd;

  get projectAdId(): string | undefined {
    return this.projectAd?.id;
  }
}
