import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followApi, blockApi, muteApi } from '@/services/userInteractionsApi';
import {
  FollowResponseDto,
  FollowersListResponseDto,
  FollowingListResponseDto,
  BlockResponseDto,
  BlockedUsersListResponseDto,
  MuteResponseDto,
  MutedUsersListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';

// Query keys
export const INTERACTION_QUERY_KEYS = {
  // Follow keys
  followers: (userId: number, params?: PaginationParams) =>
    ['interactions', 'followers', userId, params] as const,
  following: (userId: number, params?: PaginationParams) =>
    ['interactions', 'following', userId, params] as const,

  // Block keys
  blockedUsers: (params?: PaginationParams) =>
    ['interactions', 'blocked', params] as const,

  // Mute keys
  mutedUsers: (params?: PaginationParams) =>
    ['interactions', 'muted', params] as const,
};

// ==================== FOLLOW HOOKS ====================

// Hook: Follow a user
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

// Hook: Unfollow a user
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

// Hook: Get followers
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

// Hook: Get following
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

// ==================== BLOCK HOOKS ====================

// Hook: Block a user
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockResponseDto, Error, number>({
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
  });
};

// Hook: Unblock a user
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockResponseDto, Error, number>({
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
  });
};

// Hook: Get blocked users
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

// ==================== MUTE HOOKS ====================

// Hook: Mute a user
export const useMuteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<MuteResponseDto, Error, number>({
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
  });
};

// Hook: Unmute a user
export const useUnmuteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<MuteResponseDto, Error, number>({
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
  });
};

// Hook: Get muted users
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
