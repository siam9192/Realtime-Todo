import type { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import type { IResponse } from "../types/response.type";
import type { Params } from "../types";
import type { Notification } from "../types/notification.type";


export async function getUserNotifications(params:Params): Promise<IResponse<Notification[]>> {
  try {
    const res = await axiosInstance.get("/notifications",{params});
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}


export async function markAsReadNotifications(): Promise<IResponse<null>> {
  try {
    const res = await axiosInstance.patch("/notifications/mark-read");

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}