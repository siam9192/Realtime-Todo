import { CreateTaskStatusLogPayload } from './taskStatusAuditLog.interface';
import taskStatusAuditLogRepository from './taskStatusAuditLog.repository';
import taskStatusAuditLogValidations from './taskStatusAuditLog.validation';

class TaskStatusAuditLogService {
  async createLog(payload: CreateTaskStatusLogPayload) {
    const isValid =
      taskStatusAuditLogValidations.createTaskStatusLogSchema.safeParse(
        payload,
      );
    if (!isValid) return null;
    return await taskStatusAuditLogRepository.create(payload);
  }
}

export default new TaskStatusAuditLogService();
