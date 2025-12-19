import { calculatePagination } from '../../helpers/pagination.helper';
import AppError from '../../lib/AppError';
import { getAssignedUserChange } from '../../helpers/utils.helper';
import httpStatus from '../../lib/http-status';
import { AuthUser, PaginationOptions } from '../../types';
import taskStatusAuditLogService from '../taskStatusAuditLog/taskStatusAuditLog.service';
import userRepository from '../user/user.repository';
import {
  CreateTaskPayload,
  TaskFilterQuery,
  UpdateTaskPayload,
} from './task.interface';
import taskRepository from './task.repository';

class TaskService {
  async createTask(authUser: AuthUser, payload: CreateTaskPayload) {
    // Check assigned user existence
    const assignedUserExist = await userRepository.isExistById(authUser.id);
    if (!assignedUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned to user not found');
    }

    // Create task
    const createdTask = await taskRepository.create({
      ...payload,
      creatorId: authUser.id,
    });

    return { data: createdTask };
  }

  async updateTask(
    authUser: AuthUser,
    taskId: string,
    payload: UpdateTaskPayload,
  ) {
    //  Fetch task
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    //Authorization
    const isCreator = task.creatorId === authUser.id;
    const isAssignee = task.assignedToId === authUser.id;

    if (!isCreator && !isAssignee) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update this task',
      );
    }

    // Assignment change validation
    const assignedChange = getAssignedUserChange(
      task.assignedToId,
      payload.assignedToId,
    );

    if (assignedChange.changed && assignedChange.to) {
      const exists = await userRepository.isExistById(assignedChange.to);
      if (!exists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
      }
    }

    // Update task
    const updatedTask = await taskRepository.updateById(taskId, payload);

    //  Status audit log
    if (task.status !== updatedTask.status) {
      taskStatusAuditLogService.createLog({
        taskId: updatedTask.id,
        oldStatus: task.status,
        newStatus: updatedTask.status,
        changedById: authUser.id,
      });
    }

    // Response
    return {
      data: updatedTask,
      ...(assignedChange.changed && { assigned: assignedChange }),
    };
  }

  async deleteTask(authUser: AuthUser, taskId: string) {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Authorization: only creator can delete
    if (task.creatorId !== authUser.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to delete this task',
      );
    }

    // Delete task
    const deletedTask = await taskRepository.deleteById(taskId);

    return { data: deletedTask };
  }

  async getAssignedTasks(
    authUser: AuthUser,
    filterQuery: TaskFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    return await taskRepository.findAssignedTasks(
      authUser.id,
      filterQuery,
      calculatePagination(paginationOptions),
    );
  }

  async getCreatedTasks(
    authUser: AuthUser,
    filterQuery: TaskFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    return await taskRepository.findCreatedTasks(
      authUser.id,
      filterQuery,
      calculatePagination(paginationOptions),
    );
  }

  async getOverDueTasks(
    authUser: AuthUser,
    filterQuery: TaskFilterQuery,
    paginationOptions: PaginationOptions,
  ) {
    const result = await taskRepository.findOverdueTasks(
      authUser.id,
      filterQuery,
      calculatePagination(paginationOptions),
    );

    return result;
  }
}

export default new TaskService();
