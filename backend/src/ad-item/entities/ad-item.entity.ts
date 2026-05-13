import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AdCampaign } from '../../ad-campaign/entities/ad-campaign.entity';

@Entity('ad_items')
export class AdItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AdCampaign, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: AdCampaign;

  @Column({ type: 'uuid' })
  campaignId: string;

  /** 图片URL（支持 base64:data:image/... 格式） */
  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  /** 点击跳转链接 */
  @Column({ type: 'varchar', length: 1000, nullable: true })
  landingUrl: string;

  /** 关联的任务ID（可选，无关联时留空） */
  @Column({ type: 'uuid', nullable: true })
  taskId: string;

  /** 轮播时本张显示秒数，默认5秒 */
  @Column({ type: 'integer', default: 5 })
  rotationSeconds: number;

  /** 排序序号，数字越小排越前 */
  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
