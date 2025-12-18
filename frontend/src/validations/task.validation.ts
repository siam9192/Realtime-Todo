import z from "zod";
import { TaskPriority, TaskStatus } from "../types/task.type";
import { TASK_PROPERTY_LENGTH } from "../utils/constant";

const createTaskSchema = z.object({
  title: z
    .string()
    .nonempty("Title can no be empty")
    .min(
      TASK_PROPERTY_LENGTH.title.min,
      `Title must be at least ${TASK_PROPERTY_LENGTH.title.min} characters`,
    )
    .max(
      TASK_PROPERTY_LENGTH.title.max,
      `Title must be in ${TASK_PROPERTY_LENGTH.title.max} characters`,
    ),
  description: z
    .string()
    .nonempty("Description can not be empty")
    .min(
      TASK_PROPERTY_LENGTH.description.min,
      `Description must be at least ${TASK_PROPERTY_LENGTH.description.min} characters`,
    )
    .max(
      TASK_PROPERTY_LENGTH.description.max,
      `Title must be in ${TASK_PROPERTY_LENGTH.description.max} characters`,
    ),
  dueDate: z.string("Due date is required").refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getTime() > Date.now();
    },
    {
      message: "Due date must be a valid future date",
    },
  ),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  assignedToId: z.string().cuid("Invalid assignedTo").optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial();

export default {
  createTaskSchema,
  updateTaskSchema,
};
