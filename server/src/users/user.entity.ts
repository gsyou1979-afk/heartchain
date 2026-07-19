import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hc_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ type: 'integer', default: 0 })
  balance: number;           // 사용 가능 잔고

  @Column({ type: 'integer', default: 0 })
  reservedBalance: number;   // 동결 잔고

  @Column({ type: 'integer', default: 0 })
  totalPoints: number;       // 누적 포인트

  @Column({ type: 'integer', default: 1 })
  level: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  creditScore: number;        // 신용 등급 (1.0 ~ 5.0)

  @Column({ type: 'integer', default: 0 })
  helpCount: number;

  @CreateDateColumn()
  created_at: Date;
}
