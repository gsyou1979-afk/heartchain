import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_SUBMITTED = 'task_submitted',
  TASK_CANCELLED = 'task_cancelled',
  POINT_RECEIVED = 'point_received',
  POINT_SENT = 'point_sent',
  TEAM_INVITE = 'team_invite',
  TEAM_JOIN = 'team_join',
  ENDORSE_REQUEST = 'endorse_request',
  ENDORSE_CONFIRMED = 'endorse_confirmed',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: NotificationType;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 20, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Column({ type: 'simple-json', nullable: true, comment: 'Extra data for the notification' })
  data: Record<string, any>;

  @Column({ type: 'uuid', nullable: true, comment: 'Related entity ID (task/user/team/tx)' })
  relatedId: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Related entity type' })
  relatedType: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
