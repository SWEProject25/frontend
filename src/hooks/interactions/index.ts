/**
 * User Interactions Hooks
 *
 * This module provides a centralized interface for all user interaction hooks.
 * It includes functionality for following, blocking, and muting users.
 *
 * @example
 * ```tsx
 * import { useInteractions, useFollowers, useBlockedUsers } from '@/hooks/interactions';
 *
 * function MyComponent() {
 *   const { followUser, blockUser, muteUser, isAnyActionLoading } = useInteractions();
 *   const { data: followers } = useFollowers(userId);
 *
 *   // Use the hooks...
 * }
 * ```
 */

// Export all follow-related hooks
export {
  useFollow,
  useFollowUser,
  useUnfollowUser,
  useFollowers,
  useFollowing,
  useGetFollowers,
  useGetFollowing,
} from './useFollow';

// Export all block-related hooks
export {
  useBlock,
  useBlockUser,
  useUnblockUser,
  useBlockedUsers,
  useGetBlockedUsers,
} from './useBlock';

// Export all mute-related hooks
export {
  useMute,
  useMuteUser,
  useUnmuteUser,
  useMutedUsers,
  useGetMutedUsers,
} from './useMute';

// Export query keys for advanced usage
export { INTERACTION_QUERY_KEYS } from './queryKeys';

// Re-export the main composite hook for backward compatibility
export { useInteractions } from './useInteractions';
