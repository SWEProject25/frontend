import { useInteractionStore } from '@/store/interactionStore';
import { useFollowUser, useUnfollowUser } from '../userInteractionsQueries';

export const useFollow = () => {
  const { setFollowState, getFollowState } = useInteractionStore();
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  /**
   * Follow a user
   * @param userId - The ID of the user to follow
   * @returns Promise with the response
   */
  const followUser = async (userId: number) => {
    // Store previous state for rollback
    const previousState = getFollowState(userId);

    try {
      // Optimistic update
      setFollowState(userId, true);

      const response = await followMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (previousState !== undefined) {
        setFollowState(userId, previousState);
      }
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
    // Store previous state for rollback
    const previousState = getFollowState(userId);

    try {
      // Optimistic update
      setFollowState(userId, false);

      const response = await unfollowMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (previousState !== undefined) {
        setFollowState(userId, previousState);
      }
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

  return {
    followUser,
    unfollowUser,
    toggleFollow,
    getFollowState,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
    error: followMutation.error || unfollowMutation.error,
    isSuccess: followMutation.isSuccess || unfollowMutation.isSuccess,
  };
};
