import { PaginationParams } from '@/types/userInteractions';

/**
 * Query keys for React Query caching and invalidation
 * Organized by interaction type
 */
export const INTERACTION_QUERY_KEYS = {
  // Follow keys
  followers: (userId: number, params?: PaginationParams) =>
    ['interactions', 'followers', userId, params] as const,
  following: (userId: number, params?: PaginationParams) =>
    ['interactions', 'following', userId, params] as const,
  followersYouKnow: (userId: number, params?: PaginationParams) =>
    ['interactions', 'followers-you-know', userId, params] as const,

  // Block keys
  blockedUsers: (params?: PaginationParams) =>
    ['interactions', 'blocked', params] as const,

  // Mute keys
  mutedUsers: (params?: PaginationParams) =>
    ['interactions', 'muted', params] as const,
};
