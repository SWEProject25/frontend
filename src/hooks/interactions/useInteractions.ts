import { useFollow } from './useFollow';
import { useBlock } from './useBlock';
import { useMute } from './useMute';

/**
 * Main hook that provides all user interaction functionality
 * This is a composite hook that combines follow, block, and mute functionality
 *
 * @example
 * ```tsx
 * const {
 *   followUser,
 *   blockUser,
 *   muteUser,
 *   toggleFollow,
 *   isAnyActionLoading
 * } = useInteractions();
 *
 * // Follow a user
 * await followUser(123);
 *
 * // Toggle follow status
 * await toggleFollow(123, isFollowing);
 * ```
 */
export const useInteractions = () => {
  const follow = useFollow();
  const block = useBlock();
  const mute = useMute();

  return {
    // ==================== FOLLOW FUNCTIONS ====================
    followUser: follow.followUser,
    unfollowUser: follow.unfollowUser,
    toggleFollow: follow.toggleFollow,

    // ==================== BLOCK FUNCTIONS ====================
    blockUser: block.blockUser,
    unblockUser: block.unblockUser,
    toggleBlock: block.toggleBlock,

    // ==================== MUTE FUNCTIONS ====================
    muteUser: mute.muteUser,
    unmuteUser: mute.unmuteUser,
    toggleMute: mute.toggleMute,

    // ==================== LOADING STATES ====================
    isFollowing: follow.isFollowing,
    isUnfollowing: follow.isUnfollowing,
    isBlocking: block.isBlocking,
    isUnblocking: block.isUnblocking,
    isMuting: mute.isMuting,
    isUnmuting: mute.isUnmuting,

    // Combined loading states
    isFollowLoading: follow.isLoading,
    isBlockLoading: block.isLoading,
    isMuteLoading: mute.isLoading,
    isAnyActionLoading: follow.isLoading || block.isLoading || mute.isLoading,

    // ==================== ERROR STATES ====================
    followError: follow.error,
    blockError: block.error,
    muteError: mute.error,

    // ==================== SUCCESS STATES ====================
    isFollowSuccess: follow.isSuccess,
    isBlockSuccess: block.isSuccess,
    isMuteSuccess: mute.isSuccess,
  };
};
