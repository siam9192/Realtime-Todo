import AppError from '../../lib/AppError';
import httpStatus from '../../lib/http-status';
import { AuthUser, PaginationOptions } from '../../types';
import userRepository from '../user/user.repository';
import { CreateNotificationPayload, instantNotifyPayload } from './notification.interface';
import notificationRepository from './notification.repository';
import { calculatePagination } from '../../helpers/pagination.helper';
import { getIO, getUserSocketIds, getUsersSocketIds } from '../../socket/socketStore';

class NotificationService {
  
  async createNotification(payload: CreateNotificationPayload) {
    // Check user existence
    const isUserExist = userRepository.isExistById(payload.userId);
    if (!isUserExist)
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    return await notificationRepository.create(payload);
  }

  async getUserNotifications(
    authUser: AuthUser,
    paginationOptions: PaginationOptions,
  ) {
    return await notificationRepository.findUserNotifications(
      authUser.id,
      calculatePagination(paginationOptions),
    );
  }

  async markUserNotificationsAsRead(authUser: AuthUser) {
    return await notificationRepository.updateUserNotificationsAsRead(
      authUser.id,
    );
  }

 async instantNotifyToUsers(userIds: string[], payload: instantNotifyPayload) {
  
  await notificationRepository.createMany(
    userIds.map(id => ({ ...payload, userId: id }))
  );

 
  const io = getIO();

  
  const socketIds = getUsersSocketIds(userIds)
  
  if (socketIds.length) {
    io.to(socketIds).emit("new-notification", {
      title: payload.title,
      message: payload.message,
    });
  }
}

}

export default new NotificationService();
