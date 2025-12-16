import { Prisma, Task } from '@prisma/client';
import { prisma } from '../../prisma';
import { FilterQuery, PaginationData } from '../../types';
import { TaskFilterQuery } from './task.interface';

export type TaskWithInclude<T extends Prisma.TaskInclude> =
  Prisma.TaskGetPayload<{
    include: T;
  }>;

class TaskRepository {
  private buildTasksWhere(
    filterQuery: FilterQuery = {},
  ): Prisma.TaskWhereInput {
    const { searchTerm, ...otherFilters } = filterQuery;

    const andConditions: Prisma.TaskWhereInput[] = [];

    // Search
    if (searchTerm) {
      andConditions.push({
        title: {
          contains: String(searchTerm),
          mode: 'insensitive',
        },
      });
    }

    // Keep only valid filter values
    const validOtherFilters = Object.fromEntries(
      Object.entries(otherFilters).filter(
        ([_, value]) => value !== undefined && value !== null && value,
      ),
    );

    if (Object.keys(validOtherFilters).length > 0) {
      andConditions.push(validOtherFilters);
    }

    return {
      ...(andConditions.length ? { AND: andConditions } : {}),
    };
  }

  private task = prisma.task;

  async isTaskExist(id: string) {
    const user = await this.task.findUnique({
      where: {
        id,
      },
      select: null,
    });
    return !!user;
  }

  async create(data: Prisma.TaskUncheckedCreateInput) {
    return this.task.create({ data });
  }

  async findById(
    taskId: string,
    options: { include?: Prisma.UserInclude; select?: Prisma.UserSelect } = {},
  ) {
    return prisma.task.findUnique({
      where: { id: taskId },
      ...options,
    });
  }

  async findByIdWithOwnership(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        creatorId: true,
        assignedToId: true,
      },
    });
  }

  async updateById(taskId: string, data: Prisma.TaskUncheckedUpdateInput) {
    return this.task.update({
      where: { id: taskId },
      data,
    });
  }

  async deleteById(taskId: string) {
    return this.task.delete({
      where: { id: taskId },
    });
  }

  async findAssignedTasks(
    userId: string,
    filterQuery: TaskFilterQuery = {},
    PaginationData: PaginationData,
  ) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationData;

    const where = this.buildTasksWhere({
      ...filterQuery,
      assignedToId: userId,
    });

    const data = await this.task.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        creator: {
          select: {
            name: true,
            profilePhoto: true,
            email: true,
            username: true,
          },
        },
      },
    });

    const totalResults = await prisma.task.count({
      where: where,
    });

    const meta = {
      page,
      limit,
      totalResults,
    };
    return {
      data,
      meta,
    };
  }

  async findCreatedTasks(
    userId: string,
    filterQuery: TaskFilterQuery = {},
    PaginationData: PaginationData,
  ) {
    const { page, limit, skip, sortBy, sortOrder } = PaginationData;
    const where = this.buildTasksWhere({ ...filterQuery, creatorId: userId });
    const data = await this.task.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        assignedTo: {
          select: {
            name: true,
            profilePhoto: true,
            email: true,
            username: true,
          },
        },
      },
    });
    const totalResults = await prisma.task.count({
      where: where,
    });

    const meta = {
      page,
      limit,
      totalResults,
    };
    return {
      data,
      meta,
    };
  }

  async findOverdueTasks(
    userId: string,
    filterQuery: TaskFilterQuery = {},
    paginationData: PaginationData,
  ) {
    const { page, skip, limit } = paginationData;

    const where = {
      ...this.buildTasksWhere({
        ...filterQuery,
        assignedToId: userId,
      }),

      OR: [
        {
          creatorId: userId,
        },
        {
          assignedToId: userId,
        },
      ],
      dueDate: {
        gte: new Date(),
      },
    };
    const data = await this.task.findMany({
      where: where,
      skip,
      take: limit,
      include: {
        creator: {
          select: {
            name: true,
            profilePhoto: true,
            email: true,
            username: true,
          },
        },
        assignedTo: {
          select: {
            name: true,
            profilePhoto: true,
            email: true,
            username: true,
          },
        },
      },
    });
    const totalResults = await this.task.count({
      where: where,
    });

    const meta = {
      page,
      limit,
      totalResults,
    };
    return {
      data,
      meta,
    };
  }

  async countTasksWithFilter(filter: FilterQuery) {
    return await this.task.count({
      where: this.buildTasksWhere(filter),
    });
  }

  async countTasks(where: Prisma.TaskWhereInput = {}) {
    return await this.task.count({ where });
  }
}

export default new TaskRepository();
