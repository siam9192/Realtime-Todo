import { getCurrentUser, getVisibleUsers } from "../../api-services/user.api.service";
import type { Params } from "../../types";

import type { CurrentUser, User } from "../../types/user.type";
import useFetch from "../client/useFetch";

export function userGetCurrentUserQuery() {
  return useFetch<CurrentUser>(["currentUser"], () => getCurrentUser(), {
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function userGetVisibleUsersQuery(params: Params) {
  return useFetch<User[]>(["getVisibleUsers"], () => getVisibleUsers(params));
}
