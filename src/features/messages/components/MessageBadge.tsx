'use client';

import React from 'react';
import { useTotalUnseenCount } from '../hooks/useUnseenCounts';

interface MessageBadgeProps {
  className?: string;
  maxCount?: number;
  showZero?: boolean;
  variant?: 'icon' | 'inline'; // New prop to control positioning
}

/**
 * Badge component to display unseen messages count
 * Works independently from notifications system
 * Uses only the Messages API for accurate count
 */
export const MessageBadge: React.FC<MessageBadgeProps> = ({
  className = '',
  maxCount = 99,
  showZero = false,
  variant = 'icon', // Default to icon positioning for sidebar
}) => {
  // Get total unseen messages count from Messages API only
  const { data: unseenCount = 0, isLoading } = useTotalUnseenCount(true);

  // Don't show badge if loading or count is 0 (unless showZero is true)
  if (isLoading || (!showZero && unseenCount === 0)) {
    return null;
  }

  // Format count (e.g., 99+ if over maxCount)
  const displayCount =
    unseenCount > maxCount ? `${maxCount}+` : unseenCount.toString();

  // Different styling based on variant
  const baseClasses =
    variant === 'icon'
      ? 'absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 py-0.5 text-xs font-bold text-white ring-2 ring-background'
      : 'flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-white';

  return (
    <span
      className={`${baseClasses} ${className}`}
      aria-label={`${unseenCount} unseen messages`}
    >
      {displayCount}
    </span>
  );
};

export default MessageBadge;
