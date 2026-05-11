import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AdTypeEnum } from './ad-impression.entity';

@Entity('ad_clicks')
@Index(['adType', 'createdAt'])
export class AdClick {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  impressionId: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  adType: AdTypeEnum;

  @Column({ type: 'uuid', nullable: true })
  creativeId: string;

  @Column({ type: 'uuid', nullable: true })
  projectAdId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  placementCode: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  landingUrl: string;

  @Column({ type: 'boolean', default: false })
  isBot: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
