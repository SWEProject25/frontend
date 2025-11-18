/**
 * @deprecated This file is deprecated. Please import from '@/hooks/interactions' instead.
 * This file is kept for backward compatibility and will be removed in a future version.
 *
 * @example
 * // Old (deprecated)
 * import { useInteractions } from '@/hooks/useInteractions';
 *
 * // New (recommended)
 * import { useInteractions } from '@/hooks/interactions';
 */

// Re-export everything from the new location
export {
  useInteractions,
  useFollow,
  useBlock,
  useMute,
  useFollowers,
  useFollowing,
  useBlockedUsers,
  useMutedUsers,
  useFollowUser,
  useUnfollowUser,
  useBlockUser,
  useUnblockUser,
  useMuteUser,
  useUnmuteUser,
  useGetFollowers,
  useGetFollowing,
  useGetBlockedUsers,
  useGetMutedUsers,
  INTERACTION_QUERY_KEYS,
} from './interactions';
