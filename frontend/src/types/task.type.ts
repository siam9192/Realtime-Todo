import type z from "zod";
import type taskValidation from "../validations/task.validation";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  creatorId: string;
  assignedToId: string;
  creator: TaskUser;
  assignedTo: TaskUser;
}

export type TaskUser = {
  id: string;
  name: string;
  username: string;
  profilePhoto: string;
};
export enum TaskStatus {
  To_Do = "To_Do",
  In_Progress = "In_Progress",
  Review = "Review",
  Completed = "Completed",
}

export enum TaskPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export type CreateTaskPayload = z.infer<typeof taskValidation.createTaskSchema>;

export type UpdateTaskPayload = z.infer<typeof taskValidation.updateTaskSchema>;
