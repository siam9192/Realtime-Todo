import { AuthUser } from '../../types';
import metaDataRepository from './metadata.repository';

class MetadataService {
  private repo = metaDataRepository;

  async getUserGlobalMetadata(authUser: AuthUser) {
    const [totalCreatedTasks, totalAssignedTasks, totalOverdueTasks] =
      await Promise.all([
        this.repo.countUserCreatedTasks(authUser.id),
        this.repo.countUserAssignedTasks(authUser.id),
        this.repo.countUserOverdueTasks(authUser.id),
      ]);

    return { totalCreatedTasks, totalAssignedTasks, totalOverdueTasks };
  }

  async getUserNotificationsMetadata(authUser: AuthUser) {
    const [unreadCount, totalNotifications] = await Promise.all([
      this.repo.countUserUnreadNotifications(authUser.id),
      this.repo.countUserNotifications(authUser.id),
    ]);

    return { totalUnread: unreadCount, total: totalNotifications };
  }
}

export default new MetadataService();
