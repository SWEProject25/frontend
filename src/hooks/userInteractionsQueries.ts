/**
 * @deprecated This file is deprecated. Please import from '@/hooks/interactions' instead.
 * This file is kept for backward compatibility and will be removed in a future version.
 *
 * @example
 * // Old (deprecated)
 * import { useFollowUser } from '@/hooks/userInteractionsQueries';
 *
 * // New (recommended)
 * import { useFollowUser } from '@/hooks/interactions';
 */

// Re-export everything from the new location
export {
  INTERACTION_QUERY_KEYS,
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowing,
  useBlockUser,
  useUnblockUser,
  useGetBlockedUsers,
  useMuteUser,
  useUnmuteUser,
  useGetMutedUsers,
} from './interactions';
