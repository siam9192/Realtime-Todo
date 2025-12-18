import type { AxiosError } from "axios";
import axiosInstance from "../utils/axiosInstance";
import type { IResponse } from "../types/response.type";
import type { CurrentUser, User } from "../types/user.type";
import type { Params } from "../types";

export async function getCurrentUser(): Promise<IResponse<CurrentUser>> {
  try {
    const res = await axiosInstance.get("/users/me");

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}

export async function getVisibleUsers(params: Params = {}): Promise<IResponse<User[]>> {
  try {
    const res = await axiosInstance.get("/users/visible", { params });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}
