import { useInteractionStore } from '@/store/interactionStore';
import { useMuteUser, useUnmuteUser } from '../userInteractionsQueries';

export const useMute = () => {
  const { addMutedUser, removeMutedUser, isUserMuted } = useInteractionStore();
  const muteMutation = useMuteUser();
  const unmuteMutation = useUnmuteUser();

  /**
   * Mute a user
   * @param userId - The ID of the user to mute
   * @param userInfo - Optional user information for optimistic update
   * @returns Promise with the response
   */
  const muteUser = async (
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
    const wasMuted = isUserMuted(userId);

    try {
      // Optimistic update
      if (userInfo) {
        addMutedUser({
          id: userId,
          username: userInfo.username,
          name: userInfo.name,
          profile_image_url: userInfo.profile_image_url,
          bio: userInfo.bio,
          verified: userInfo.verified,
          mutedAt: new Date().toISOString(),
        });
      }

      const response = await muteMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (!wasMuted) {
        removeMutedUser(userId);
      }
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
    // Store previous state for rollback
    const wasMuted = isUserMuted(userId);
    const mutedUsers = useInteractionStore.getState().mutedUsers;
    const previousUser = mutedUsers.find((user) => user.id === userId);

    try {
      // Optimistic update
      removeMutedUser(userId);

      const response = await unmuteMutation.mutateAsync(userId);
      return response;
    } catch (error) {
      // Rollback on error
      if (wasMuted && previousUser) {
        addMutedUser(previousUser);
      }
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

  return {
    muteUser,
    unmuteUser,
    toggleMute,
    isUserMuted,
    isMuting: muteMutation.isPending,
    isUnmuting: unmuteMutation.isPending,
    isLoading: muteMutation.isPending || unmuteMutation.isPending,
    error: muteMutation.error || unmuteMutation.error,
    isSuccess: muteMutation.isSuccess || unmuteMutation.isSuccess,
  };
};
