import { calculatePagination } from '../../helpers/pagination.helper';
import AppError from '../../lib/AppError';
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

    return {
      data: createdTask,
    };
  }

  async updateTask(
    authUser: AuthUser,
    taskId: string,
    payload: UpdateTaskPayload,
  ) {
    let hasAssignedUserChanged = false;

    // Fetch task
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Authorization: only creator can update
    if (task.creatorId !== authUser.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to update this task',
      );
    }

    // Validate assigned user if changed
    const { assignedToId } = payload;
    if (assignedToId && assignedToId !== task.assignedToId) {
      const assignedUserExists = await userRepository.isExistById(assignedToId);
      if (!assignedUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
      }
      hasAssignedUserChanged = true;
    }

    // Update task
    const updatedTask = await taskRepository.updateById(taskId, payload);

    const hasStatusChanged = task.status !== updatedTask.status;

    // If status has changed, asynchronously create an audit log
    if (hasStatusChanged) {
      taskStatusAuditLogService.createLog({
        taskId: updatedTask.id,
        oldStatus: task.status,
        newStatus: updatedTask.status,
        changedById: authUser.id,
      });
    }

    return {
      data: updatedTask,
      ...(hasAssignedUserChanged
        ? { assigned: { from: task.assignedToId, to: payload.assignedToId } }
        : {}),
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

    return {
      data: deletedTask,
    };
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
    result.data.map((_) => ({ ..._, isCreator: _.creatorId === authUser.id }));
    return result;
  }
}

export default new TaskService();
