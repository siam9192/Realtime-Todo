import { TaskStatus } from '@prisma/client';
import z from 'zod';
import { createTaskStatusLogSchema } from './taskStatusAuditLog.validation';

export type CreateTaskStatusLogPayload = z.infer<
  typeof createTaskStatusLogSchema
>;
