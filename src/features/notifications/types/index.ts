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
 * Post data structure for notifications
 */
export interface NotificationPost {
  userId: number;
  username: string;
  verified: boolean;
  name: string;
  avatar: string | null;
  postId: number;
  date: string | Record<string, never>; // Can be string or empty object from Firebase
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isFollowedByMe: boolean;
  isRepostedByMe: boolean;
  text: string;
  media: any[];
  isRepost: boolean;
  isQuote: boolean;
  originalPostData?: NotificationPost; // For quote posts
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
  quotePostId?: number;

  // Full post data (for REPLY and QUOTE notifications)
  post?: NotificationPost;

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
 * Matches the exact structure sent from backend via Firestore
 */
export interface FirebaseNotificationEvent {
  id: string;
  type: NotificationType;
  recipientId: number;
  actor: NotificationActor;
  isRead: boolean;
  createdAt: string;

  // Post-related fields (for LIKE, REPOST, MENTION, REPLY, QUOTE)
  postId?: number;
  postPreviewText?: string;

  // Reply-specific fields
  replyId?: number;
  threadPostId?: number;

  // Quote-specific fields
  quotePostId?: number;

  // Full post data (included in REPLY, QUOTE, and MENTION notifications)
  post?: NotificationPost;

  // DM-specific fields
  conversationId?: number;
  messageId?: string;
  messagePreview?: string;
}
