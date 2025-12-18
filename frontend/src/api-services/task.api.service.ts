import type { AxiosError } from "axios";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types/task.type";
import axiosInstance from "../utils/axiosInstance";
import type { Params } from "../types";
import type { IResponse } from "../types/response.type";

export async function createTask(payload: CreateTaskPayload) {
  try {
    const res = await axiosInstance.post("/tasks", payload);

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function updateTask({ id, payload }: { id: string; payload: UpdateTaskPayload }) {
  try {
    const res = await axiosInstance.put(`/tasks/${id}`, payload);

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function deleteTask(id: string) {
  try {
    const res = await axiosInstance.delete(`/tasks/${id}`);

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function getAssignedTasks(params: Params): Promise<IResponse<Task[]>> {
  try {
    const res = await axiosInstance.get("/tasks/assigned", { params });

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function getOverdueTasks(params: Params): Promise<IResponse<Task[]>> {
  try {
    const res = await axiosInstance.get("/tasks/overdue", { params });

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function getCreatedTasks(params: Params): Promise<IResponse<Task[]>> {
  try {
    const res = await axiosInstance.get("/tasks/created", { params });

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}
