/**
 * @deprecated Use individual hooks from '@/hooks/userInteractions' instead
 * This file is kept for backward compatibility
 *
 * New usage:
 * - import { useFollow } from '@/hooks/userInteractions';
 * - import { useBlock } from '@/hooks/userInteractions';
 * - import { useMute } from '@/hooks/userInteractions';
 * - import { useFollowers, useFollowing } from '@/hooks/userInteractions';
 * - import { useBlockedUsers, useMutedUsers } from '@/hooks/userInteractions';
 */

import { useFollow } from './userInteractions/useFollow';
import { useBlock } from './userInteractions/useBlock';
import { useMute } from './userInteractions/useMute';
import { PaginationParams } from '@/types/userInteractions';
import {
  useGetFollowers,
  useGetFollowing,
  useGetBlockedUsers,
  useGetMutedUsers,
} from './userInteractionsQueries';

export const useInteractions = () => {
  const follow = useFollow();
  const block = useBlock();
  const mute = useMute();

  return {
    // Follow functions
    followUser: follow.followUser,
    unfollowUser: follow.unfollowUser,
    toggleFollow: follow.toggleFollow,
    getFollowState: follow.getFollowState,

    // Block functions
    blockUser: block.blockUser,
    unblockUser: block.unblockUser,
    toggleBlock: block.toggleBlock,
    isUserBlocked: block.isUserBlocked,

    // Mute functions
    muteUser: mute.muteUser,
    unmuteUser: mute.unmuteUser,
    toggleMute: mute.toggleMute,
    isUserMuted: mute.isUserMuted,

    // Loading states
    isFollowing: follow.isFollowing,
    isUnfollowing: follow.isUnfollowing,
    isBlocking: block.isBlocking,
    isUnblocking: block.isUnblocking,
    isMuting: mute.isMuting,
    isUnmuting: mute.isUnmuting,
    isFollowLoading: follow.isLoading,
    isBlockLoading: block.isLoading,
    isMuteLoading: mute.isLoading,
    isAnyActionLoading: follow.isLoading || block.isLoading || mute.isLoading,

    // Error states
    followError: follow.error,
    blockError: block.error,
    muteError: mute.error,

    // Success states
    isFollowSuccess: follow.isSuccess,
    isBlockSuccess: block.isSuccess,
    isMuteSuccess: mute.isSuccess,
  };
};

// ==================== HOOK FOR FETCHING LISTS ====================

/**
 * Hook to fetch followers list
 * @param userId - The user ID to fetch followers for
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useFollowers = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowers(userId, params, enabled);
};

/**
 * Hook to fetch following list
 * @param userId - The user ID to fetch following for
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useFollowing = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowing(userId, params, enabled);
};

/**
 * Hook to fetch blocked users list
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useBlockedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetBlockedUsers(params, enabled);
};

/**
 * Hook to fetch muted users list
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useMutedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetMutedUsers(params, enabled);
};
