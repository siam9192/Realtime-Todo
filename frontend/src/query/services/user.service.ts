import {
  getCurrentUser,
  getVisibleUsers,
  updateUserProfile,
} from "../../api-services/user.api.service";
import type { Params } from "../../types";

import type { CurrentUser, UpdateUserProfilePayload, User } from "../../types/user.type";
import useFetch from "../client/useFetch";
import useMutate from "../client/useMutation";

export function userGetCurrentUserQuery() {
  return useFetch<CurrentUser>(["currentUser"], () => getCurrentUser(), {
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function userGetVisibleUsersQuery(params: Params) {
  return useFetch<User[]>(["getVisibleUsers"], () => getVisibleUsers(params));
}

export function useGetVisibleUsersQuery(params: Params) {
  return useFetch<User[]>(["getVisibleUsers"], () => getVisibleUsers(params));
}

export function useUpdateUserProfileMutation() {
  return useMutate<User, UpdateUserProfilePayload>(updateUserProfile);
}
