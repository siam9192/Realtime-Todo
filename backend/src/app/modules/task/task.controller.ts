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
import { emitTaskEvent, notifyUser } from '../../helpers/utils.helper';

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

  updateTask = catchAsync(async (req, res) => {
    const { user: authUser, body, params } = req;

    const { data, assigned } = await taskService.updateTask(
      authUser,
      params.id,
      body,
    );

    const taskMeta = { id: data.id, title: data.title };

    //  Handle assignment changes
    if (assigned?.from) {
      notifyUser(
        assigned.from,
        taskMeta,
        'Task Unassigned',
        `You have been unassigned from task: ${data.title}`,
        NotificationCategory.TASK_UNASSIGNED,
      );

      emitTaskEvent(assigned.from, TaskEvent.UNASSIGNED, data.id);
    }

    if (assigned?.to) {
      notifyUser(
        assigned.to,
        taskMeta,
        'New Task Assigned',
        `You have been assigned a task: ${data.title}`,
        NotificationCategory.TASK_ASSIGNED,
      );

      emitTaskEvent(assigned.to, TaskEvent.ASSIGNED, data.id);
    }

    //  Emit task updated
    const recipients = new Set<string>();

    recipients.add(data.creatorId);

    if (!assigned && data.assignedToId) {
      recipients.add(data.assignedToId);
    }

    emitToUsers([...recipients], TaskEvent.UPDATED, { id: data.id });

    //  Response
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
      { id: data.id },
    );

    sendSuccessResponse(res, {
      message: 'Task deleted  successfully',
      statusCode: httpStatus.OK,
      data: null,
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
    const result = await taskService.getOverDueTasks(
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
