import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma';

class TaskStatusAuditLogRepository {
  private taskStatusLog = prisma.taskStatusAuditLog;
  async create(data: Prisma.TaskStatusAuditLogUncheckedCreateInput) {
    return await this.taskStatusLog.create({ data });
  }
}

export default new TaskStatusAuditLogRepository();
