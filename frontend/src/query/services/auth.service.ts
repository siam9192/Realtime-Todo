import { userLogin, userRegister } from "../../api-services/auth.api.service";
import type { UserLoginPayload, UserRegisterPayload } from "../../types/auth.type";
import type { User } from "../../types/user.type";
import useMutate from "../client/useMutation";

export function userUserRegistrationMutation() {
  return useMutate<User, UserRegisterPayload>(userRegister);
}

export function userUserLoginMutation() {
  return useMutate<User, UserLoginPayload>(userLogin);
}
