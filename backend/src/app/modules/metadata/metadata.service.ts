import { AuthUser } from '../../types';
import metadataRepository from './metaData.repository';

 class MetadataService {
  private repo = metadataRepository;


  async getUserGlobalMetadata(authUser:AuthUser) {
    const [totalCreatedTasks, totalAssignedTasks,totalOverdueTasks] = await Promise.all([
      this.repo.countUserCreatedTasks(authUser.id), 
      this.repo.countUserAssignedTasks(authUser.id),
      this.repo.countUserOverdueTasks(authUser.id)
    ]);

    return {
     totalCreatedTasks,
     totalAssignedTasks,
     totalOverdueTasks
    };
  }


  async getUserNotificationsMetadata(userId: string) {
    const [unreadCount, totalNotifications] = await Promise.all([
      this.repo.countUserUnreadNotifications(userId),
      this.repo.countUserNotifications(userId),
    ]);

    return {
      unreadCount,
      totalNotifications,
    };
  }

}

export default new MetadataService()