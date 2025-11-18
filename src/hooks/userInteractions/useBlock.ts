import { useInteractionStore } from '@/store/interactionStore';
import { useBlockUser, useUnblockUser } from '../userInteractionsQueries';

export const useBlock = () => {
  const { addBlockedUser, removeBlockedUser, isUserBlocked } =
    useInteractionStore();
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  /**
   * Block a user
   * @param userId - The ID of the user to block
   * @param userInfo - Optional user information for optimistic update
   * @returns Promise with the response
   */
  const blockUser = async (
    userId: number,
    userInfo?: {
      username: string;
      name: string;
      profile_image_url?: string;
      bio?: string;
      verified?: boolean;
    }
  ) => {
    // Store previous state for rollback
    const wasBlocked = isUserBlocked(userId);

    try {
      // Optimistic update
      if (userInfo) {
        addBlockedUser({
          id: userId,
          username: userInfo.username,
          name: userInfo.name,
          profile_image_url: userInfo.profile_image_url,
          bio: userInfo.bio,
          verified: userInfo.verified,
          blockedAt: new Date().toISOString(),
        });
      }

      const response = await blockMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (!wasBlocked) {
        removeBlockedUser(userId);
      }
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
    // Store previous state for rollback
    const wasBlocked = isUserBlocked(userId);
    const blockedUsers = useInteractionStore.getState().blockedUsers;
    const previousUser = blockedUsers.find((user) => user.id === userId);

    try {
      // Optimistic update
      removeBlockedUser(userId);

      const response = await unblockMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (wasBlocked && previousUser) {
        addBlockedUser(previousUser);
      }
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

  return {
    blockUser,
    unblockUser,
    toggleBlock,
    isUserBlocked,
    isBlocking: blockMutation.isPending,
    isUnblocking: unblockMutation.isPending,
    isLoading: blockMutation.isPending || unblockMutation.isPending,
    error: blockMutation.error || unblockMutation.error,
    isSuccess: blockMutation.isSuccess || unblockMutation.isSuccess,
  };
};
