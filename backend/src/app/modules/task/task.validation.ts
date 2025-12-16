import { z } from 'zod';
import { Priority, TaskStatus } from '@prisma/client';

const createTaskSchema = z.object({
  title: z.string().nonempty('Title must be at least 1 characters'),
  description: z.string().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus),
  assignedToId: z.string().cuid('Invalid user ID'),
});

const updateTaskSchema = createTaskSchema.partial();

const taskValidations = {
  createTaskSchema,
  updateTaskSchema,
};

export default taskValidations;
