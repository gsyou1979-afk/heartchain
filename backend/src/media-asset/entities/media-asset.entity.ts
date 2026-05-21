import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaderId' })
  uploader: User;

  @Column({ type: 'uuid', nullable: true })
  uploaderId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  url: string;

  @Column({ type: 'text', nullable: true })
  dataUrl: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mimeType: string;

  @Column({ type: 'integer', nullable: true })
  size: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  storage: string; // 'cloudinary' | 'local' | 'database'

  @Column({ type: 'varchar', length: 255, nullable: true })
  publicId: string; // Cloudinary public_id

  @Column({ type: 'varchar', length: 50, default: 'image' })
  assetType: string; // 'image' | 'video'

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
