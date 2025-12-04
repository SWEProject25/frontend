'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/generic';
import {
  LikeNotificationIcon,
  RepostNotificationIcon,
  ReplyNotificationIcon,
  FollowNotificationIcon,
  DMNotificationIcon,
} from '@/components/ui/icons';
import { Notification, NotificationType } from '../types';
import { useMarkAsRead } from '../hooks';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

/**
 * Individual notification item component
 * Handles different notification types (LIKE, REPLY, FOLLOW, etc.)
 */
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const { mutate: markAsRead } = useMarkAsRead();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const destination = getNotificationLink();
    router.push(destination);
    onClick?.();

    // Mark as read in background (if not already read)
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = () => {
    switch (notification.type) {
      case NotificationType.LIKE:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
            <LikeNotificationIcon className="text-pink-600 dark:text-pink-400" />
          </div>
        );
      case NotificationType.REPOST:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <RepostNotificationIcon className="text-green-600 dark:text-green-400" />
          </div>
        );
      case NotificationType.REPLY:
      case NotificationType.QUOTE:
      case NotificationType.MENTION:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <ReplyNotificationIcon className="text-primary" />
          </div>
        );
      case NotificationType.FOLLOW:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <FollowNotificationIcon className="text-purple-600 dark:text-purple-400" />
          </div>
        );
      case NotificationType.DM:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <DMNotificationIcon className="text-yellow-600 dark:text-yellow-400" />
          </div>
        );
      default:
        return null;
    }
  };

  /**
   * Get the link destination based on notification type
   */
  const getNotificationLink = () => {
    switch (notification.type) {
      case NotificationType.FOLLOW:
        return `/${notification.actor.username}`;
      case NotificationType.DM:
        // Use conversationId if available, fallback to messageId
        return notification.conversationId
          ? `/messages/${notification.conversationId}`
          : notification.messageId
            ? `/messages/${notification.messageId}`
            : '/messages';
      case NotificationType.LIKE:
      case NotificationType.REPOST:
      case NotificationType.QUOTE:
      case NotificationType.REPLY:
      case NotificationType.MENTION:
        return `/home/${notification.postId}`;
      default:
        return '#';
    }
  };

  /**
   * Format time to match X's style (41s, 4m, 2h, etc.)
   */
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex cursor-pointer gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-white/5 ${
        !notification.isRead ? 'bg-primary/10 border-l-4 border-l-primary' : ''
      }`}
    >
      {/* Left side - Icon */}
      <div className="flex w-10 shrink-0 justify-end pt-1">
        {getNotificationIcon()}
      </div>

      {/* Right side - Content */}
      <div className="min-w-0 flex-1">
        {/* Avatar, name, handle, and time in one line */}
        <div className="flex items-center gap-2 mb-1">
          <Avatar
            avatarImage={notification.actor.avatarUrl}
            name={notification.actor.displayName}
            size="sm"
            position="relative"
          />
          <div className="flex flex-wrap items-baseline gap-1 min-w-0">
            <span className="font-bold text-foreground truncate">
              {notification.actor.displayName}
            </span>
            <span className="text-[15px] text-secondary truncate">
              @{notification.actor.username}
            </span>
            <span className="text-secondary">·</span>
            <span className="text-[15px] text-secondary whitespace-nowrap">
              {formatTimeAgo(notification.createdAt)}
            </span>
          </div>
        </div>

        {/* Action description */}
        <p className="text-[15px] text-secondary">
          {notification.type === NotificationType.LIKE && 'liked your post'}
          {notification.type === NotificationType.REPOST &&
            'reposted your post'}
          {notification.type === NotificationType.QUOTE && 'quoted your post'}
          {notification.type === NotificationType.REPLY &&
            'replied to your post'}
          {notification.type === NotificationType.MENTION && 'mentioned you'}
          {notification.type === NotificationType.FOLLOW && 'followed you'}
          {notification.type === NotificationType.DM && 'sent you a message'}
        </p>

        {/* Post preview (for post-related notifications) */}
        {notification.postPreviewText && (
          <div className="mt-2 rounded border border-border p-3 text-[15px] text-secondary">
            <p className="line-clamp-3">{notification.postPreviewText}</p>
          </div>
        )}

        {/* Message preview (for DM notifications) */}
        {notification.messagePreview &&
          notification.type === NotificationType.DM && (
            <div className="mt-2 rounded border border-border p-3 text-[15px] text-secondary">
              <p className="line-clamp-2">{notification.messagePreview}</p>
            </div>
          )}
      </div>

      {/* Unread indicator dot - top right corner */}
      {!notification.isRead && (
        <div className="shrink-0 self-start pt-1">
          <div
            className="h-2 w-2 rounded-full bg-primary"
            aria-label="Unread"
          />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
