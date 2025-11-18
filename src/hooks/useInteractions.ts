import {
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
} from './userInteractionsQueries';
import { PaginationParams } from '@/types/userInteractions';

export const useInteractions = () => {
  // Get all mutation hooks
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();
  const muteMutation = useMuteUser();
  const unmuteMutation = useUnmuteUser();

  // ==================== FOLLOW FUNCTIONS ====================

  /**
   * Follow a user
   * @param userId - The ID of the user to follow
   * @returns Promise with the response
   */
  const followUser = async (userId: number) => {
    try {
      const response = await followMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  };

  /**
   * Unfollow a user
   * @param userId - The ID of the user to unfollow
   * @returns Promise with the response
   */
  const unfollowUser = async (userId: number) => {
    try {
      const response = await unfollowMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  };

  /**
   * Toggle follow status (follow if not following, unfollow if following)
   * @param userId - The ID of the user
   * @param isCurrentlyFollowing - Current follow status
   * @returns Promise with the response
   */
  const toggleFollow = async (
    userId: number,
    isCurrentlyFollowing: boolean
  ) => {
    try {
      if (isCurrentlyFollowing) {
        return await unfollowUser(userId);
      } else {
        return await followUser(userId);
      }
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
      throw error;
    }
  };

  // ==================== BLOCK FUNCTIONS ====================

  /**
   * Block a user
   * @param userId - The ID of the user to block
   * @returns Promise with the response
   */
  const blockUser = async (userId: number) => {
    try {
      const response = await blockMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to block user:', error);
      throw error;
    }
  };

  /**
   * Unblock a user
   * @param userId - The ID of the user to unblock
   * @returns Promise with the response
   */
  const unblockUser = async (userId: number) => {
    try {
      const response = await unblockMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to unblock user:', error);
      throw error;
    }
  };

  /**
   * Toggle block status (block if not blocked, unblock if blocked)
   * @param userId - The ID of the user
   * @param isCurrentlyBlocked - Current block status
   * @returns Promise with the response
   */
  const toggleBlock = async (userId: number, isCurrentlyBlocked: boolean) => {
    try {
      if (isCurrentlyBlocked) {
        return await unblockUser(userId);
      } else {
        return await blockUser(userId);
      }
    } catch (error) {
      console.error('Failed to toggle block status:', error);
      throw error;
    }
  };

  // ==================== MUTE FUNCTIONS ====================

  /**
   * Mute a user
   * @param userId - The ID of the user to mute
   * @returns Promise with the response
   */
  const muteUser = async (userId: number) => {
    try {
      const response = await muteMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to mute user:', error);
      throw error;
    }
  };

  /**
   * Unmute a user
   * @param userId - The ID of the user to unmute
   * @returns Promise with the response
   */
  const unmuteUser = async (userId: number) => {
    try {
      const response = await unmuteMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      console.error('Failed to unmute user:', error);
      throw error;
    }
  };

  /**
   * Toggle mute status (mute if not muted, unmute if muted)
   * @param userId - The ID of the user
   * @param isCurrentlyMuted - Current mute status
   * @returns Promise with the response
   */
  const toggleMute = async (userId: number, isCurrentlyMuted: boolean) => {
    try {
      if (isCurrentlyMuted) {
        return await unmuteUser(userId);
      } else {
        return await muteUser(userId);
      }
    } catch (error) {
      console.error('Failed to toggle mute status:', error);
      throw error;
    }
  };

  // ==================== LOADING STATES ====================

  const isFollowing = followMutation.isPending;
  const isUnfollowing = unfollowMutation.isPending;
  const isBlocking = blockMutation.isPending;
  const isUnblocking = unblockMutation.isPending;
  const isMuting = muteMutation.isPending;
  const isUnmuting = unmuteMutation.isPending;

  // Combined loading states
  const isFollowLoading = isFollowing || isUnfollowing;
  const isBlockLoading = isBlocking || isUnblocking;
  const isMuteLoading = isMuting || isUnmuting;
  const isAnyActionLoading = isFollowLoading || isBlockLoading || isMuteLoading;

  // ==================== ERROR STATES ====================

  const followError = followMutation.error || unfollowMutation.error;
  const blockError = blockMutation.error || unblockMutation.error;
  const muteError = muteMutation.error || unmuteMutation.error;

  // ==================== SUCCESS STATES ====================

  const isFollowSuccess =
    followMutation.isSuccess || unfollowMutation.isSuccess;
  const isBlockSuccess = blockMutation.isSuccess || unblockMutation.isSuccess;
  const isMuteSuccess = muteMutation.isSuccess || unmuteMutation.isSuccess;

  return {
    // Follow functions
    followUser,
    unfollowUser,
    toggleFollow,

    // Block functions
    blockUser,
    unblockUser,
    toggleBlock,

    // Mute functions
    muteUser,
    unmuteUser,
    toggleMute,

    // Loading states
    isFollowing,
    isUnfollowing,
    isBlocking,
    isUnblocking,
    isMuting,
    isUnmuting,
    isFollowLoading,
    isBlockLoading,
    isMuteLoading,
    isAnyActionLoading,

    // Error states
    followError,
    blockError,
    muteError,

    // Success states
    isFollowSuccess,
    isBlockSuccess,
    isMuteSuccess,
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
