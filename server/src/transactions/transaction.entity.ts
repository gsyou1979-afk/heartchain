import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type TransactionType =
  | 'income'
  | 'expense'
  | 'recharge'
  | 'withdraw'
  | 'mint'      // 신규 민팅 (기본 보상)
  | 'bonus'     // 추가 보상 (transfer에 포함)
  | 'transfer'  // 이체
  | 'refund'    // 환불
  | 'reserve'   // 동결
  | 'release';  // 동결 해제

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ length: 30 })
  type: TransactionType;

  @Column({ type: 'integer', default: 0 })
  amount: number;

  @Column({ type: 'integer', default: 0 })
  points: number;

  @Column({ length: 300, nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  reference: string; // task_id 등 참조 키

  @Column({ nullable: true })
  related_user_id: number; // 상대방 사용자 ID

  @Column({ length: 20, default: 'completed' })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
