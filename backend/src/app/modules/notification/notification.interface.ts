import { NotificationCategory, NotificationType } from '@prisma/client';

export interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  type: NotificationType;
  entityId?: string;
}

export interface instantNotifyPayload {
  title: string;
  message: string;
  category: NotificationCategory;
  type: NotificationType;
  entityId?: string;
}
