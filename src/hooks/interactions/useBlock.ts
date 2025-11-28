import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blockApi } from '@/services/userInteractionsApi';
import {
  BlockResponseDto,
  BlockedUsersListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';
import { INTERACTION_QUERY_KEYS } from './queryKeys';
import { useOptimisticTweet } from '@/features/timeline/optimistics/Tweets';
import { OPTIMISTIC_TYPES } from '@/features/timeline/constants/api';

// ==================== MUTATION HOOKS ====================

/**
 * Hook to block a user
 * Invalidates blocked users list, user profile, and follow lists on success
 */
export const useBlockUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    BlockResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
    mutationFn: async (userId: number) => {
      try {
        const response = await blockApi.blockUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to block user';
        throw new Error(errorMessage);
      }
    },
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.BLOCK, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: (_, userId) => {
      // Invalidate blocked users list
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'blocked'],
      });
      // Invalidate the specific user's profile
      queryClient.invalidateQueries({
        queryKey: ['profile', 'user', userId],
      });
      // Also invalidate following/followers as blocking affects these
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'following'],
      });
    },
    networkMode: 'always',
  });
};

/**
 * Hook to unblock a user
 * Invalidates blocked users list and user profile on success
 */
export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    BlockResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
    mutationFn: async (userId: number) => {
      try {
        const response = await blockApi.unblockUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to unblock user';
        throw new Error(errorMessage);
      }
    },
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.BLOCK, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: (_, userId) => {
      // Invalidate blocked users list
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'blocked'],
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
 * Hook to fetch list of blocked users
 * @param params - Pagination parameters (page, limit)
 * @param enabled - Whether the query should be enabled
 */
export const useGetBlockedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery<BlockedUsersListResponseDto, Error>({
    queryKey: INTERACTION_QUERY_KEYS.blockedUsers(params),
    queryFn: async () => {
      try {
        const response = await blockApi.getBlockedUsers(params);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch blocked users';
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
 * Hook that provides all block-related functionality
 * Includes block/unblock mutations and their loading/error states
 */
export const useBlock = () => {
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  /**
   * Block a user
   * @param userId - The ID of the user to block
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
    // Actions
    blockUser,
    unblockUser,
    toggleBlock,

    // Loading states
    isBlocking: blockMutation.isPending,
    isUnblocking: unblockMutation.isPending,
    isLoading: blockMutation.isPending || unblockMutation.isPending,

    // Error state
    error: blockMutation.error || unblockMutation.error,

    // Success state
    isSuccess: blockMutation.isSuccess || unblockMutation.isSuccess,
  };
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
