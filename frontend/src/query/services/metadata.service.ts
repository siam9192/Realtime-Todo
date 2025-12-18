import {
  getUserGlobalMetadata,
  getUserNotificationsMetadata,
} from "../../api-services/metadata.api.service";
import type { UserGlobalMetadata, UserNotificationsMetadata } from "../../types/metadata.type";
import useFetch from "../client/useFetch";

export function useGetUserGlobalMetadataQuery() {
  return useFetch<UserGlobalMetadata>(["getUserGlobalMetadata"], () => getUserGlobalMetadata());
}

export function useGetUserNotificationsQuery() {
  return useFetch<UserNotificationsMetadata>(["GetUserNotificationsQuery"], () =>
    getUserNotificationsMetadata(),
  );
}
