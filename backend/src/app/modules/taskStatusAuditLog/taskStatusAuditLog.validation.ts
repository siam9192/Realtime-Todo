import { TaskStatus } from '@prisma/client';
import z from 'zod';

export const createTaskStatusLogSchema = z
  .object({
    taskId: z.string().cuid(),
    oldStatus: z.nativeEnum(TaskStatus),
    newStatus: z.nativeEnum(TaskStatus),
    changedById: z.string().cuid(),
  })
  .refine((data) => data.oldStatus !== data.newStatus, {
    message: 'New status must be different from old status',
    path: ['newStatus'], // error will point here
  });

const taskStatusAuditLogValidations = { createTaskStatusLogSchema };

export default taskStatusAuditLogValidations;
