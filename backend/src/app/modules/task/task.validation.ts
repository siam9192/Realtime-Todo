import { z } from 'zod';
import { Priority, TaskStatus } from '@prisma/client';

const createTaskSchema = z.object({
  title: z.string().nonempty('Title must be at least 1 characters'),
  description: z.string().nonempty(),
  dueDate: z.preprocess((val) => {
    if (typeof val === 'string' || val instanceof Date) {
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  }, z.date('Valid Due date is required')),

  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus),
  assignedToId: z.string().cuid("assignedToId is required").optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial();

const taskValidations = {
  createTaskSchema,
  updateTaskSchema,
};

export default taskValidations;
