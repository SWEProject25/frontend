import { NotificationType } from '../types';

/**
 * API Endpoints for notifications
 */
export const NOTIFICATION_ENDPOINTS = {
  BASE: '/api/v1.0/notifications',
  UNREAD_COUNT: '/api/v1.0/notifications/unread-count',
  MARK_READ: (id: string) => `/api/v1.0/notifications/${id}/read`,
  MARK_ALL_READ: '/api/v1.0/notifications/read-all',
} as const;

/**
 * Query keys for React Query
 */
export const NOTIFICATION_QUERY_KEYS = {
  ALL: ['notifications'] as const,
  LIST: (params?: Record<string, unknown>) =>
    ['notifications', 'list', params] as const,
  UNREAD_COUNT: ['notifications', 'unread-count'] as const,
  DETAIL: (id: string) => ['notifications', 'detail', id] as const,
} as const;

/**
 * Default pagination settings
 */
export const NOTIFICATION_DEFAULTS = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
  POLLING_INTERVAL: 30000, // 30 seconds
} as const;

/**
 * Notification text templates
 */
export const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  (actor: string) => string
> = {
  [NotificationType.LIKE]: (actor: string) => `${actor} liked your post`,
  [NotificationType.REPOST]: (actor: string) => `${actor} reposted your post`,
  [NotificationType.QUOTE]: (actor: string) => `${actor} quoted your post`,
  [NotificationType.REPLY]: (actor: string) => `${actor} replied to your post`,
  [NotificationType.MENTION]: (actor: string) => `${actor} mentioned you`,
  [NotificationType.FOLLOW]: (actor: string) => `${actor} followed you`,
  [NotificationType.DM]: (actor: string) => `${actor} sent you a message`,
};

/**
 * Notification icons mapping
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  [NotificationType.LIKE]: '❤️',
  [NotificationType.REPOST]: '🔁',
  [NotificationType.QUOTE]: '💬',
  [NotificationType.REPLY]: '💬',
  [NotificationType.MENTION]: '@',
  [NotificationType.FOLLOW]: '👤',
  [NotificationType.DM]: '✉️',
};

/**
 * Notification filter tabs
 */
export const NOTIFICATION_TABS = [
  { id: 'all', label: 'All', value: 'all' },
  { id: 'verified', label: 'Verified', value: 'verified' },
  { id: 'mentions', label: 'Mentions', value: 'mentions' },
] as const;
