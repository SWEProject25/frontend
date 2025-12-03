import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import { followApi } from '@/services/userInteractionsApi';
import {
  FollowResponseDto,
  FollowersListResponseDto,
  FollowingListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';
import { INTERACTION_QUERY_KEYS } from './queryKeys';
import { useOptimisticTweet } from '@/features/timeline/optimistics/Tweets';
import { OPTIMISTIC_TYPES } from '@/features/timeline/constants/api';

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    FollowResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
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
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.FOLLOW, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: () => {
      // Invalidate followers and following lists
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'following'],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
      // Invalidate all tweet queries to update full tweet page
      queryClient.invalidateQueries({
        queryKey: ['tweet'],
      });
    },
    networkMode: 'always',
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();

  return useMutation<
    FollowResponseDto,
    Error,
    number,
    Awaited<ReturnType<typeof onMutate>>
  >({
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
    onMutate: (userId: number) => {
      return onMutate(OPTIMISTIC_TYPES.FOLLOW, userId);
    },
    onError: (error, variables, context) => {
      handleErrorOptimisticTweet(context);
    },
    onSuccess: () => {
      // Invalidate followers and following lists
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'followers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['interactions', 'following'],
      });
      // Invalidate all profile queries to ensure UI updates everywhere
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
      // Invalidate all tweet queries to update full tweet page
      queryClient.invalidateQueries({
        queryKey: ['tweet'],
      });
    },
    networkMode: 'always',
  });
};

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

export const useFollowers = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowers(userId, params, enabled);
};

export const useFollowing = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowing(userId, params, enabled);
};

// Infinite query hooks for followers/following lists
export const useInfiniteFollowers = (userId: number, limit: number = 20) => {
  return useInfiniteQuery<
    FollowersListResponseDto,
    Error,
    InfiniteData<FollowersListResponseDto, number>,
    any,
    number
  >({
    queryKey: ['interactions', 'followers', 'infinite', userId, limit],
    queryFn: ({ pageParam }) =>
      followApi.getFollowers(userId, { page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useInfiniteFollowing = (userId: number, limit: number = 20) => {
  return useInfiniteQuery<
    FollowingListResponseDto,
    Error,
    InfiniteData<FollowingListResponseDto, number>,
    any,
    number
  >({
    queryKey: ['interactions', 'following', 'infinite', userId, limit],
    queryFn: ({ pageParam }) =>
      followApi.getFollowing(userId, { page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
