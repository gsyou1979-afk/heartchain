import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type TransactionType =
  | 'income'
  | 'expense'
  | 'recharge'
  | 'withdraw'
  | 'mint'              // 任务生成积分（平台铸造 → 完成者）
  | 'publisher_reward'  // 发布人奖励积分（平台铸造 → 发布人）
  | 'bonus'             // 额外奖励（transfer 中包含）
  | 'transfer'          // 转账
  | 'refund'            // 退款
  | 'reserve'           // 冻结
  | 'release';          // 解冻

@Entity('hc_transactions')
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
