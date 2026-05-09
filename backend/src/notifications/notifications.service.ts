import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';
import { QueryNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    content?: string;
    relatedId?: string;
    relatedType?: string;
    extraData?: Record<string, any>;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId;
    notification.type = data.type;
    notification.title = data.title;
    notification.content = data.content;
    notification.status = NotificationStatus.UNREAD;
    notification.data = data.extraData;
    notification.relatedId = data.relatedId;
    notification.relatedType = data.relatedType;

    return this.notificationRepository.save(notification);
  }

  async getMyNotifications(userId: string, dto: QueryNotificationDto) {
    const { page = 1, limit = 20, status } = dto;

    const qb = this.notificationRepository.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      qb.andWhere('notification.status = :status', { status });
    }

    const [items, total] = await qb.getManyAndCount();

    const unreadCount = await this.notificationRepository.count({
      where: { userId, status: NotificationStatus.UNREAD },
    });

    return {
      items,
      total,
      page,
      limit,
      unreadCount,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationRepository.update(
      { id, userId },
      { status: NotificationStatus.READ },
    );
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
    return { success: true };
  }
}
