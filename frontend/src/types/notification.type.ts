export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  type: NotificationType;
  entityId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isRead: boolean;
}

export enum NotificationCategory {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_UNASSIGNED = "TASK_UNASSIGNED",
  TASK_COMPLETED = "TASK_COMPLETED",
  SYSTEM = "SYSTEM",
}

export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}
