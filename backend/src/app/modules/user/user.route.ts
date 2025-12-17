import { Router } from 'express';
import userController from './user.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import userValidations from './user.validation';

const router = Router();

router.get(
  '/me',
  auth(),
  userController.getCurrentUser,
);

router.put(
  '/',
  auth(),
  validateRequest(userValidations.updateUserProfileSchema),
  userController.updateUserProfile,
);

const userRouter = router;

export default userRouter;
