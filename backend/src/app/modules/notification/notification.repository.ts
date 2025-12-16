import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';
import { PaginationData } from '../../types';

class NotificationRepository {
  private notification = prisma.notification;

  async create(data: Prisma.NotificationUncheckedCreateInput) {
    return await this.notification.create({ data });
  }

  async createMany(data: Prisma.NotificationUncheckedCreateInput[]) {
    return await this.notification.createMany({
      data,
    });
  }

  async findUserNotifications(userId: string, paginationData: PaginationData) {
    const { page, limit, skip, sortBy, sortOrder } = paginationData;

    const whereConditions: Prisma.NotificationWhereInput = {
      userId,
    };

    const notifications = await this.notification.findMany({
      where: whereConditions,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip,
    });

    const totalResults = await this.notification.count();

    const meta = {
      page,
      limit,
      totalResults,
    };

    return {
      data: notifications,
      meta,
    };
  }

  async updateUserNotificationsAsRead(userId: string) {
    return await this.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

export default new NotificationRepository();
