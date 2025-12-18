
import{  useEffect, useRef, useState, type UIEvent } from "react";
import { useLocation } from "react-router-dom";
import { useGetNotificationsQuery, useMarkAsReadNotificationsMutation } from "../../query/services/notification.service";
import { useGetUserNotificationsMetadataQuery } from "../../query/services/metadata.service";
import { Bell, BellRing} from "lucide-react";
import type { Notification } from "../../types/notification.type";
import { getTimeAgo } from "../../utils/helper";
import { queryClient } from "../../App";


const NotificationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {pathname} = useLocation();
  const barRef = useRef<HTMLDivElement>(null);

  // Query for notifications
  const {
    data: notificationData,
    isLoading: notificationsIsLoading,
    isFetching: notificationsIsRefetching,
    refetch,
  } = useGetNotificationsQuery({
    page:1,
    limit:5
  });

  const { data:notificationMetadata } = useGetUserNotificationsMetadataQuery();
  const totalUnread = notificationMetadata?.data.totalUnread??0

  const notifications = notificationData?.data ?? [];
  const meta = notificationData?.meta;
  const totalPages = meta ? Math.ceil(meta.totalResults / meta.limit) : 1;
  const { mutate: markAsReadMutate } = useMarkAsReadNotificationsMutation();



  /** Close on outside click */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const bar = barRef.current;
      if (bar && !bar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);


  
  //  Close when route changes
  useEffect(() => setIsOpen(false), [pathname]);

//  Merge notifications on new data 
  useEffect(() => {
    if (!notificationsIsLoading && !notificationsIsRefetching && notifications) {
      setAllNotifications((prev) => {
        // Avoid duplicates when refetching the same page
        const existingIds = new Set(prev.map((n) => n.id));
        const newOnes = notifications.filter((n) => !existingIds.has(n.id));
        const all = [...prev, ...newOnes];
        return all;
      });
    }
  }, [notifications, notificationsIsLoading, notificationsIsRefetching]);

  //  Infinite scroll handler
  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (
      target.scrollTop + target.clientHeight + 10 >= target.scrollHeight &&
      !notificationsIsLoading &&
      !notificationsIsRefetching &&
      page < totalPages
    ) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setPage((p) => p + 1);
        refetch();
        setIsLoadingMore(false);
      }, 600);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev)
          markAsReadMutate(undefined,{onSuccess:()=>queryClient.invalidateQueries({queryKey:['getUserNotificationsMetadataQuery','getNotifications']})})
        }}
        className="text-3xl p-2 text-txt-primary rounded-full relative hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
      >
        {totalUnread > 0 ? <BellRing /> : <Bell />}
        {totalUnread > 0 && (
          <div className="size-5 flex justify-center items-center bg-red-500 rounded-full absolute -top-1 right-0 text-[0.6rem] text-white font-semibold">
            {totalUnread}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          ref={barRef}
          onScroll={handleScroll}
          className="absolute right-0 mt-2 w-72 h-80  overflow-y-auto hide-scrollbar p-3 bg-base-100  shadow-2xl rounded-xl border border-gray-200 dark:border-neutral-700 z-40 "
        >
          <h3 className="text-lg font-semibold font-secondary text-txt-primary mb-2">
            Notifications
          </h3>

          {/* Loading State */}
          {notificationsIsLoading && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 dark:bg-neutral-800 rounded-lg h-10"
                ></div>
              ))}
            </div>
          )}

          {/* Notifications List */}
          {!notificationsIsLoading && allNotifications.length > 0 && (
            <div className="space-y-1">
              {allNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-2  hover:bg-gray-50 dark:hover:bg-base-200 rounded-lg cursor-pointer transition-colors"
                >
                 
                  <div >
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                    <h2
                      className="text-sm font-medium text-txt-primary leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: notification.title.replace(
                          /"([^"]+)"/,
                          '<span class="font-semibold text-primary">$1</span>',
                        ),
                      }}
                    />
                    {notification.message && (
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {notification.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!notificationsIsLoading && allNotifications.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-5">No notifications yet 📭</p>
          )}

          {/* Load More Spinner */}
          {isLoadingMore && (
            <p className="text-center text-gray-600 mt-2 text-sm">Loading more...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
