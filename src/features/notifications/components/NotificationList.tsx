'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader } from '@/components/generic';
import { ErrorNotificationIcon } from '@/components/ui/icons';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '../hooks';
import { GetNotificationsParams } from '../types';

interface NotificationListProps {
  params?: GetNotificationsParams;
  emptyMessage?: string;
}

/**
 * Notification list with infinite scroll
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  params,
  emptyMessage = 'No notifications yet',
}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(params);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Fetch next page when scrolled to bottom
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <ErrorNotificationIcon className="text-error" />
          <div>
            <p className="font-semibold text-foreground">
              Failed to load notifications
            </p>
            <p className="text-sm text-secondary">
              {error?.message || 'Something went wrong'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get all notifications from pages
  const notifications = data?.pages.flatMap((page) => page.data) ?? [];

  // Empty state
  if (notifications.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 px-8 text-center">
          <div>
            <p className="text-[31px] font-bold text-foreground">
              {emptyMessage}
            </p>
            <p className="mt-2 text-[15px] text-secondary">
              When you get notifications, they&apos;ll show up here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center border-b border-border py-4"
        >
          {isFetchingNextPage && <Loader />}
        </div>
      )}

      {/* End of list indicator */}
      {!hasNextPage && notifications.length > 0 && (
        <div className="border-b border-border py-8 text-center">
          <p className="text-sm text-secondary">
            You&apos;ve seen all notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
