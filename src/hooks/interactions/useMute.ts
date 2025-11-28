import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { muteApi } from '@/services/userInteractionsApi';
import {
  MuteResponseDto,
  MutedUsersListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';
import { INTERACTION_QUERY_KEYS } from './queryKeys';
import { useOptimisticTweet } from '@/features/timeline/optimistics/Tweets';
import { OPTIMISTIC_TYPES } from '@/features/timeline/constants/api';

// ==================== MUTATION HOOKS ====================

/**
 * Hook to mute a user
 * Invalidates muted users list and user profile on success
 */
export const useMuteUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    MuteResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
    mutationFn: async (userId: number) => {
      try {
        const response = await muteApi.muteUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to mute user';
        throw new Error(errorMessage);
      }
    },
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.MUTE, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: (_, userId) => {
      // Invalidate muted users list
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'muted'],
      });
      // Invalidate the specific user's profile
      queryClient.invalidateQueries({
        queryKey: ['profile', 'user', userId],
      });
    },
    networkMode: 'always',
  });
};

/**
 * Hook to unmute a user
 * Invalidates muted users list and user profile on success
 */
export const useUnmuteUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    MuteResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
    mutationFn: async (userId: number) => {
      try {
        const response = await muteApi.unmuteUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to unmute user';
        throw new Error(errorMessage);
      }
    },
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.MUTE, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: (_, userId) => {
      // Invalidate muted users list
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'muted'],
      });
      // Invalidate the specific user's profile
      queryClient.invalidateQueries({
        queryKey: ['profile', 'user', userId],
      });
    },
    networkMode: 'always',
  });
};

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch list of muted users
 * @param params - Pagination parameters (page, limit)
 * @param enabled - Whether the query should be enabled
 */
export const useGetMutedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery<MutedUsersListResponseDto, Error>({
    queryKey: INTERACTION_QUERY_KEYS.mutedUsers(params),
    queryFn: async () => {
      try {
        const response = await muteApi.getMutedUsers(params);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch muted users';
        throw new Error(errorMessage);
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// ==================== COMPOSITE HOOKS ====================

/**
 * Hook that provides all mute-related functionality
 * Includes mute/unmute mutations and their loading/error states
 */
export const useMute = () => {
  const muteMutation = useMuteUser();
  const unmuteMutation = useUnmuteUser();

  /**
   * Mute a user
   * @param userId - The ID of the user to mute
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
    // Actions
    muteUser,
    unmuteUser,
    toggleMute,

    // Loading states
    isMuting: muteMutation.isPending,
    isUnmuting: unmuteMutation.isPending,
    isLoading: muteMutation.isPending || unmuteMutation.isPending,

    // Error state
    error: muteMutation.error || unmuteMutation.error,

    // Success state
    isSuccess: muteMutation.isSuccess || unmuteMutation.isSuccess,
  };
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
