import httpStatus from "../lib/http-status";
import AppError from "../lib/AppError";
import { GLOBAL_ERROR_MESSAGE } from "../lib/constant";

export function isNumber(value: string) {
  return !isNaN(parseInt(value));
}

export function throwInternalError() {
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, GLOBAL_ERROR_MESSAGE);
}
