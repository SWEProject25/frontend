'use client';

import React from 'react';
import { useUnreadCount } from '../hooks';

interface NotificationBadgeProps {
  className?: string;
  maxCount?: number;
  showZero?: boolean;
}

/**
 * Badge component to display unread notification count
 * Typically used on the notification bell icon
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = '',
  maxCount = 99,
  showZero = false,
}) => {
  const { data: unreadCount = 0, isLoading } = useUnreadCount();

  // Don't show badge if loading or count is 0 (unless showZero is true)
  if (isLoading || (!showZero && unreadCount === 0)) {
    return null;
  }

  // Format count (e.g., 99+ if over maxCount)
  const displayCount =
    unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <span
      className={`absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-0.5 text-xs font-bold text-white ring-2 ring-background ${className}`}
      aria-label={`${unreadCount} unread notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
