import { getUserNotifications, markAsReadNotifications } from "../../api-services/notification.api.service";
import type { Params } from "../../types";
import type { Notification } from "../../types/notification.type";
import useFetch from "../client/useFetch";
import useMutate from "../client/useMutation";

export function useMarkAsReadNotificationsMutation() {
  return useMutate<null>(markAsReadNotifications);
}

export function useGetNotificationsQuery(params: Params) {
  return useFetch<Notification[]>(["getNotifications"], () => getUserNotifications(params));
}