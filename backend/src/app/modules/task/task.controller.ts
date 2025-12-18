import { NotificationCategory, NotificationType } from '@prisma/client';
import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../lib/catchAsync';
import httpStatus from '../../lib/http-status';
import { pick } from '../../lib/pick';
import { sendSuccessResponse } from '../../lib/response';
import notificationService from '../notification/notification.service';
import taskService from './task.service';
import { emitToUser, emitToUsers } from '../../helpers/io.hepler';
import { TaskEvent } from '../../types';

class TaskController {
  createTask = catchAsync(async (req, res) => {
    //  Create the task
    const { data } = await taskService.createTask(req.user, req.body);

    const notificationPayload = {
      title: 'New Task Assigned',
      message: `You have been assigned a task: ${data.title}`,
      category: NotificationCategory.TASK_ASSIGNED,
      type: NotificationType.Info,
      entityId: data.id,
    };

    // Emit task created event to creator
    emitToUser(data.creatorId, TaskEvent.CREATED, { id: data.id });

    //  Send instant notification and  Emit task assigned event to assignee
    if (data.assignedToId) {
      notificationService.instantNotifyToUsers(
        [data.assignedToId],
        notificationPayload,
      );
      emitToUser(data.assignedToId, TaskEvent.ASSIGNED, { id: data.id });
    }

    sendSuccessResponse(res, {
      message: 'Task created successfully',
      statusCode: httpStatus.CREATED,
      data,
    });
  });

  /* How update task work 
1  Request
   ↓
2  updateTask service
   ↓
3  prepare notify helper
   ↓
4  assignment changed?
   ↓
5  UNASSIGN (from) → notify +  emit
   ↓
6  ASSIGN (to) → notify + emit
   ↓
7  emit task:updated
   ↓
8  HTTP response */

  updateTask = catchAsync(async (req, res) => {
    const { user: authUser, body, params } = req;

    const { data, assigned } = await taskService.updateTask(
      authUser,
      params.id,
      body,
    );

    const notify = (
      userId: string,
      title: string,
      message: string,
      category: NotificationCategory,
    ) => {
      notificationService.instantNotifyToUsers([userId], {
        title,
        message,
        category,
        type: NotificationType.Info,
        entityId: data.id,
      });
    };

    // Assignment changes
    if (assigned?.from) {
      notify(
        assigned.from,
        'Task Unassigned',
        `You have been unassigned from task: ${data.title}`,
        NotificationCategory.TASK_UNASSIGNED,
      );

      emitToUser(assigned.from, TaskEvent.UNASSIGNED, { id: data.id });
    }

    if (assigned?.to) {
      notify(
        assigned.to,
        'New Task Assigned',
        `You have been assigned a task: ${data.title}`,
        NotificationCategory.TASK_ASSIGNED,
      );

      emitToUser(assigned.to, TaskEvent.ASSIGNED, { id: data.id });
    }

    // Emit task updated event to creator and if assignment no changes  then assigned user also
    emitToUsers(
      (assigned
        ? [data.creatorId]
        : [data.creatorId, data.assignedToId]
      ).filter((_) => _ !== null),
      TaskEvent.UPDATED,
      { id: data.id },
    );

    sendSuccessResponse(res, {
      message: 'Task updated successfully',
      statusCode: httpStatus.OK,
      data,
    });
  });

  deleteTask = catchAsync(async (req, res) => {
    const { data } = await taskService.deleteTask(req.user, req.params.id);

    emitToUsers(
      [data.creatorId, data.assignedToId].filter((_) => _ !== null),
      TaskEvent.DELETED,
      {
        id: data.id,
      },
    );

    sendSuccessResponse(res, {
      message: 'Task deleted  successfully',
      statusCode: httpStatus.OK,
      data:null,
    });
  });

  getAssignedTasks = catchAsync(async (req, res) => {
    const result = await taskService.getAssignedTasks(
      req.user,
      pick(req.query, ['searchTerm', 'status', 'priority']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Assigned tasks retrieved   successfully',
      statusCode: httpStatus.OK,
    ...result,
    });
  });

  getCreatedTasks = catchAsync(async (req, res) => {
    const result = await taskService.getCreatedTasks(
      req.user,
      pick(req.query, ['searchTerm', 'status', 'priority']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Created tasks retrieved   successfully',
      statusCode: httpStatus.OK,
     ...result,
    });
  });

  getOverdueTasks = catchAsync(async (req, res) => {
    const result = await taskService.getCreatedTasks(
      req.user,
      pick(req.query, ['searchTerm', 'status', 'priority']),
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Overdue tasks retrieved   successfully',
      statusCode: httpStatus.OK,
    ...result,
    });
  });
}

export default new TaskController();
