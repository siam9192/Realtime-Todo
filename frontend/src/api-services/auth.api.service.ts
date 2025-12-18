import type { AxiosError } from "axios";
import type { UserLoginPayload, UserRegisterPayload } from "../types/auth.type";
import axiosInstance from "../utils/axiosInstance";

export async function userRegister(payload: UserRegisterPayload) {
  try {
    const res = await axiosInstance.post("/auth/register", payload);

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    const message = error.response?.data?.message || error.message || "Something went wrong";

    throw new Error(message);
  }
}

export async function userLogin(payload: UserLoginPayload) {
  try {
    const res = await axiosInstance.post("/auth/login", payload);

    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;

    // Custom error message (backend message OR fallback)
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Re-throw clean error
    throw new Error(message);
  }
}
