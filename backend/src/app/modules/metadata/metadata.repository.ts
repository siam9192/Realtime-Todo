import { TaskStatus } from '@prisma/client';
import { prisma } from '../../prisma';

class MetadataRepository {
  async countUserAssignedTasks(userId: string) {
    return prisma.task.count({
      where: { assignedToId: userId },
    });
  }

  async countUserCreatedTasks(userId: string) {
    return prisma.task.count({
      where: { creatorId: userId },
    });
  }

  async countUserOverdueTasks(userId: string) {
    const now = new Date();
    return prisma.task.count({
      where: {
        assignedToId: userId,
        dueDate: { lt: now },
        status: { not: TaskStatus.Completed },
      },
    });
  }

  async countUsers() {
    return prisma.user.count();
  }

  async countUserUnreadNotifications(userId: string) {
    return  prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // Count total notifications for a user
  async countUserNotifications(userId: string) {
    return  prisma.notification.count({
      where: { userId },
    });
  }
}

export default new MetadataRepository();
