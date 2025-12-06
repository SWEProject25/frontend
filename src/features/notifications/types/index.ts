/**
 * Notification Types
 * Matches backend NotificationType enum
 */
export enum NotificationType {
  LIKE = 'LIKE',
  REPOST = 'REPOST',
  QUOTE = 'QUOTE',
  REPLY = 'REPLY',
  MENTION = 'MENTION',
  FOLLOW = 'FOLLOW',
  DM = 'DM',
}

/**
 * Actor (user who triggered the notification)
 */
export interface NotificationActor {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

/**
 * Base Notification Interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  recipientId: number;
  actor: NotificationActor;
  isRead: boolean;
  createdAt: string;

  // Post-related fields (optional, depending on notification type)
  postId?: number;
  replyId?: number;
  threadPostId?: number;
  postPreviewText?: string;

  // Quote-specific fields
  quoteId?: number;

  // DM-specific fields
  conversationId?: number;
  messageId?: string;
  messagePreview?: string;
}

/**
 * Notification Metadata (pagination info)
 */
export interface NotificationMetadata {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

/**
 * API Response for GET /notifications
 */
export interface GetNotificationsResponse {
  data: Notification[];
  metadata: NotificationMetadata;
}

/**
 * API Response for GET /notifications/unread-count
 */
export interface GetUnreadCountResponse {
  unreadCount: number;
}

/**
 * API Request params for GET /notifications
 */
export interface GetNotificationsParams extends Record<string, unknown> {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  include?: string; // Comma-separated notification types to include (e.g., "DM,MENTION")
  exclude?: string; // Comma-separated notification types to exclude (e.g., "DM")
}

/**
 * Notification Filter Types (for tabs)
 */
export type NotificationFilter = 'all' | 'verified' | 'mentions';

/**
 * Firebase real-time notification event
 */
export interface FirebaseNotificationEvent {
  notificationId: string;
  type: NotificationType;
  createdAt: string;
  actorId: number;
}
