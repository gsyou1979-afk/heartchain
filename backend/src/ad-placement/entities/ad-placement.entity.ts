import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ad_placements')
export class AdPlacement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  platform: string; // web / ios / android

  @Column({ type: 'varchar', length: 100, nullable: false })
  page: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  position: string; // hero / sidebar / feed / footer / splash

  @Column({ type: 'int', nullable: false })
  width: number;

  @Column({ type: 'int', nullable: false })
  height: number;

  @Column({ type: 'simple-array', nullable: true })
  supportedTypes: string[]; // commercial / public_service / project

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  floorCpm: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
