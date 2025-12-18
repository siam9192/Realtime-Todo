import type { Params } from "../../types";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../../types/task.type";
import useFetch from "../client/useFetch";
import {
  createTask,
  deleteTask,
  getAssignedTasks,
  getCreatedTasks,
  updateTask,
} from "../../api-services/task.api.service";
import useMutate from "../client/useMutation";

export function useCreateTaskMutation() {
  return useMutate<Task, CreateTaskPayload>(createTask);
}

export function useUpdateTaskMutation() {
  return useMutate<Task, { id: string; payload: UpdateTaskPayload }>(updateTask);
}

export function useDeleteTaskMutation() {
  return useMutate<null, string>(deleteTask);
}

export function useGetCreatedTasksQuery(params: Params) {
  return useFetch<Task[]>(["tasks", "created"], () => getCreatedTasks(params));
}

export function useGetAssignedTasksQuery(params: Params) {
  return useFetch<Task[]>(["tasks", "assigned"], () => getAssignedTasks(params));
}

export function useGetOverdueTasksQuery(params: Params) {
  return useFetch<Task[]>(["tasks", "overdue"], () => getAssignedTasks(params));
}
