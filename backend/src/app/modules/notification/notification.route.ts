import { Router } from 'express';
import auth from '../../middlewares/auth';
import notificationController from './notification.controller';

const router = Router();

router.post('/', auth(), notificationController.getNotifications);

router.patch('/mark-read', auth(), notificationController.markUsersNotificationsAsRead);

const notificationRouter = router;

export default notificationRouter;
