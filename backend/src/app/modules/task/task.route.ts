import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import taskValidations from './task.validation';
import auth from '../../middlewares/auth';
import taskController from './task.controller';

const router = Router();
router.post(
  '/',
  auth(),
  validateRequest(taskValidations.createTaskSchema),
  taskController.createTask,
);

router.put(
  '/:id',
  auth(),
  validateRequest(taskValidations.updateTaskSchema),
  taskController.updateTask,
);

router.delete('/:id', auth(), taskController.deleteTask);

router.get('/created', auth(), taskController.getCreatedTasks);

router.get('/assigned', auth(), taskController.getAssignedTasks);

router.get('/overdue', auth(), taskController.getOverdueTasks);

const taskRouter = router;

export default taskRouter;
