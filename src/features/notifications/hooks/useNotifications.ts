import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { notificationsApi } from '../api';
import {
  GetNotificationsResponse,
  GetNotificationsParams,
  Notification,
} from '../types';
import { NOTIFICATION_QUERY_KEYS, NOTIFICATION_DEFAULTS } from '../constants';

/**
 * Hook to fetch paginated notifications with infinite scroll
 * Uses optimistic caching to reduce API calls
 */
export const useNotifications = (params?: GetNotificationsParams) => {
  return useInfiniteQuery<GetNotificationsResponse, Error>({
    queryKey: NOTIFICATION_QUERY_KEYS.LIST(params),
    queryFn: async ({ pageParam = NOTIFICATION_DEFAULTS.INITIAL_PAGE }) => {
      try {
        const response = await notificationsApi.getNotifications({
          ...params,
          page: pageParam as number,
          limit: params?.limit || NOTIFICATION_DEFAULTS.PAGE_SIZE,
        });
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch notifications';
        throw new Error(errorMessage);
      }
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: NOTIFICATION_DEFAULTS.INITIAL_PAGE,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    refetchOnMount: false, // Don't refetch on mount if data is fresh
    refetchOnReconnect: true, // Do refetch when internet reconnects
  });
};

/**
 * Hook to fetch unread notifications only
 */
export const useUnreadNotifications = () => {
  return useNotifications({ unreadOnly: true });
};

/**
 * Hook to fetch unread count
 * Uses aggressive caching to prevent excessive API calls
 */
export const useUnreadCount = (
  params?: Pick<GetNotificationsParams, 'include' | 'exclude'>
) => {
  return useQuery({
    queryKey: params
      ? [...NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, params]
      : NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
    queryFn: async () => {
      try {
        console.log('🔄 Fetching unread count from API:', params);
        const response = await notificationsApi.getUnreadCount(params);
        console.log('✅ Unread count received:', response.unreadCount);
        return response.unreadCount;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch unread count';
        throw new Error(errorMessage);
      }
    },
    staleTime: NOTIFICATION_DEFAULTS.POLLING_INTERVAL, // Consider data fresh for 30s
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchInterval: NOTIFICATION_DEFAULTS.POLLING_INTERVAL, // Poll every 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on tab switch - rely on polling
    refetchOnMount: false, // Don't refetch on mount if data is fresh
    refetchOnReconnect: true, // Do refetch when internet reconnects
  });
};

/**
 * Hook to mark a single notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Notification,
    Error,
    string,
    {
      previousNotifications?: InfiniteData<GetNotificationsResponse>;
      previousUnreadCount?: number;
    }
  >({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await notificationsApi.markAsRead(notificationId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to mark notification as read';
        throw new Error(errorMessage);
      }
    },
    onMutate: async (notificationId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.ALL,
      });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<
        InfiniteData<GetNotificationsResponse>
      >(NOTIFICATION_QUERY_KEYS.LIST());

      // Snapshot previous unread count
      const previousUnreadCount = queryClient.getQueryData<number>(
        NOTIFICATION_QUERY_KEYS.UNREAD_COUNT
      );

      // Find the notification to get its type (for filtered counts)
      let notificationType: string | null = null;
      if (previousNotifications?.pages) {
        for (const page of previousNotifications.pages) {
          const notification = page.data.find((n) => n.id === notificationId);
          if (notification) {
            notificationType = notification.type;
            break;
          }
        }
      }

      // Optimistically update notification list - mark as read
      queryClient.setQueriesData<InfiniteData<GetNotificationsResponse>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.ALL },
        (old) => {
          if (!old || !old.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) =>
                notification.id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              ),
            })),
          };
        }
      );

      // Optimistically update main unread count
      queryClient.setQueryData<number>(
        NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
        (old) => {
          const newCount = old ? Math.max(0, old - 1) : 0;
          return newCount;
        }
      );

      // Also update filtered counts if we know the notification type
      if (notificationType) {
        if (notificationType === 'DM') {
          // Decrement DM count
          queryClient.setQueryData<number>(
            [...NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, { include: 'DM' }],
            (old) => (old ? Math.max(0, old - 1) : 0)
          );
        } else {
          // Decrement non-DM count
          queryClient.setQueryData<number>(
            [...NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, { exclude: 'DM' }],
            (old) => (old ? Math.max(0, old - 1) : 0)
          );
        }
      }

      return { previousNotifications, previousUnreadCount };
    },
    onError: (error, notificationId, context) => {
      // Revert notification list on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.LIST(),
          context.previousNotifications
        );
      }

      // Revert unread count on error
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
          context.previousUnreadCount
        );
      }
    },
    onSuccess: () => {
      // Invalidate to ensure consistency with server
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
      });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    void,
    {
      previousNotifications?: InfiniteData<GetNotificationsResponse>;
      previousUnreadCount?: number;
    }
  >({
    mutationFn: async () => {
      try {
        const response = await notificationsApi.markAllAsRead();
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to mark all notifications as read';
        throw new Error(errorMessage);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.ALL,
      });

      // Snapshot previous values
      const previousNotifications = queryClient.getQueryData<
        InfiniteData<GetNotificationsResponse>
      >(NOTIFICATION_QUERY_KEYS.LIST());

      const previousUnreadCount = queryClient.getQueryData<number>(
        NOTIFICATION_QUERY_KEYS.UNREAD_COUNT
      );

      // Optimistically mark all as read
      queryClient.setQueriesData<InfiniteData<GetNotificationsResponse>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.ALL },
        (old) => {
          if (!old || !old.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.map((notification) => ({
                ...notification,
                isRead: true,
              })),
              metadata: {
                ...page.metadata,
                unreadCount: 0,
              },
            })),
          };
        }
      );

      // Set unread count to 0
      queryClient.setQueryData(NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, 0);

      return { previousNotifications, previousUnreadCount };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.LIST(),
          context.previousNotifications
        );
      }
      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(
          NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
          context.previousUnreadCount
        );
      }
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.ALL,
      });
    },
  });
};
