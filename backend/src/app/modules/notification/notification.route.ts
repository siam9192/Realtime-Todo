import { Router } from 'express';
import auth from '../../middlewares/auth';
import notificationController from './notification.controller';

const router = Router();

router.post('/', auth(), notificationController.getNotifications);

const notificationRouter = router;

export default notificationRouter;
