'use client';

import React from 'react';
import { useUnreadCount } from '@/features/notifications/hooks';

interface MessageBadgeProps {
  className?: string;
  maxCount?: number;
  showZero?: boolean;
  variant?: 'icon' | 'inline'; // New prop to control positioning
}

/**
 * Badge component to display unread message (DM) notification count
 * Can be used on icons (absolute) or inline (relative)
 * Shows only DM-type notifications
 */
export const MessageBadge: React.FC<MessageBadgeProps> = ({
  className = '',
  maxCount = 99,
  showZero = false,
  variant = 'icon', // Default to icon positioning for sidebar
}) => {
  // Include only DM notifications
  const { data: unreadCount = 0, isLoading } = useUnreadCount({
    include: 'DM',
  });

  // Don't show badge if loading or count is 0 (unless showZero is true)
  if (isLoading || (!showZero && unreadCount === 0)) {
    return null;
  }

  // Format count (e.g., 99+ if over maxCount)
  const displayCount =
    unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  // Different styling based on variant
  const baseClasses =
    variant === 'icon'
      ? 'absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-0.5 text-xs font-bold text-white ring-2 ring-background'
      : 'flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white';

  return (
    <span
      className={`${baseClasses} ${className}`}
      aria-label={`${unreadCount} unread messages`}
    >
      {displayCount}
    </span>
  );
};

export default MessageBadge;
