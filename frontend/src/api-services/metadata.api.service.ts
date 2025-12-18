import type { AxiosError } from "axios";
import type { UserGlobalMetadata, UserNotificationsMetadata } from "../types/metadata.type";
import type { IResponse } from "../types/response.type";
import axiosInstance from "../utils/axiosInstance";

export async function getUserGlobalMetadata(): Promise<IResponse<UserGlobalMetadata>> {
  try {
    const res = await axiosInstance.get("/metadata/global");

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function getUserNotificationsMetadata(): Promise<
  IResponse<UserNotificationsMetadata>
> {
  try {
    const res = await axiosInstance.get("/metadata/notifications");

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}
