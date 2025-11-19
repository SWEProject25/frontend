import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followApi } from '@/services/userInteractionsApi';
import {
  FollowResponseDto,
  FollowersListResponseDto,
  FollowingListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';
import { INTERACTION_QUERY_KEYS } from './queryKeys';

// ==================== MUTATION HOOKS ====================

/**
 * Hook to follow a user
 * Invalidates followers, following lists, and user profile on success
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<FollowResponseDto, Error, number>({
    mutationFn: async (userId: number) => {
      try {
        const response = await followApi.followUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to follow user';
        throw new Error(errorMessage);
      }
    },
    onSuccess: (_, userId) => {
      // Invalidate followers and following lists
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'following'],
      });
      // Invalidate the specific user's profile
      queryClient.invalidateQueries({
        queryKey: ['profile', 'user', userId],
      });
    },
  });
};

/**
 * Hook to unfollow a user
 * Invalidates followers, following lists, and user profile on success
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation<FollowResponseDto, Error, number>({
    mutationFn: async (userId: number) => {
      try {
        const response = await followApi.unfollowUser(userId);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to unfollow user';
        throw new Error(errorMessage);
      }
    },
    onSuccess: (_, userId) => {
      // Invalidate followers and following lists
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'following'],
      });
      // Invalidate the specific user's profile
      queryClient.invalidateQueries({
        queryKey: ['profile', 'user', userId],
      });
    },
  });
};

// ==================== QUERY HOOKS ====================

/**
 * Hook to fetch a user's followers
 * @param userId - The user ID to fetch followers for
 * @param params - Pagination parameters (page, limit)
 * @param enabled - Whether the query should be enabled
 */
export const useGetFollowers = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery<FollowersListResponseDto, Error>({
    queryKey: INTERACTION_QUERY_KEYS.followers(userId, params),
    queryFn: async () => {
      try {
        const response = await followApi.getFollowers(userId, params);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch followers';
        throw new Error(errorMessage);
      }
    },
    enabled: enabled && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to fetch users that a user is following
 * @param userId - The user ID to fetch following for
 * @param params - Pagination parameters (page, limit)
 * @param enabled - Whether the query should be enabled
 */
export const useGetFollowing = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useQuery<FollowingListResponseDto, Error>({
    queryKey: INTERACTION_QUERY_KEYS.following(userId, params),
    queryFn: async () => {
      try {
        const response = await followApi.getFollowing(userId, params);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch following';
        throw new Error(errorMessage);
      }
    },
    enabled: enabled && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// ==================== COMPOSITE HOOKS ====================

/**
 * Hook that provides all follow-related functionality
 * Includes follow/unfollow mutations and their loading/error states
 */
export const useFollow = () => {
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  /**
   * Follow a user
   * @param userId - The ID of the user to follow
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
    // Actions
    followUser,
    unfollowUser,
    toggleFollow,

    // Loading states
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isLoading: followMutation.isPending || unfollowMutation.isPending,

    // Error state
    error: followMutation.error || unfollowMutation.error,

    // Success state
    isSuccess: followMutation.isSuccess || unfollowMutation.isSuccess,
  };
};

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
