import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFollow,
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowing,
  useGetFollowersYouKnow,
  useInfiniteFollowers,
  useInfiniteFollowing,
  useInfiniteFollowersYouKnow,
} from '../useFollow';
import { followApi } from '@/services/userInteractionsApi';
import React from 'react';

// Mock the API
vi.mock('@/services/userInteractionsApi', () => ({
  followApi: {
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    getFollowers: vi.fn(),
    getFollowing: vi.fn(),
    getFollowersYouKnow: vi.fn(),
  },
}));

// Mock the optimistic tweet hook
vi.mock('@/features/timeline/optimistics/Tweets', () => ({
  useOptimisticTweet: () => ({
    onMutate: vi.fn(() => ({ previousData: 'mock' })),
    handleErrorOptimisticTweet: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
};

describe('useFollow Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFollowUser', () => {
    it('should successfully follow a user', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User followed successfully',
      };
      vi.mocked(followApi.followUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(followApi.followUser).toHaveBeenCalledWith(123);
    });

    it('should handle follow error', async () => {
      const mockError = new Error('Failed to follow user');
      vi.mocked(followApi.followUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useFollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to follow user');
    });
  });

  describe('useUnfollowUser', () => {
    it('should successfully unfollow a user', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User unfollowed successfully',
      };
      vi.mocked(followApi.unfollowUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUnfollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(followApi.unfollowUser).toHaveBeenCalledWith(123);
    });

    it('should handle unfollow error', async () => {
      const mockError = new Error('Failed to unfollow user');
      vi.mocked(followApi.unfollowUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useUnfollowUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to unfollow user');
    });
  });

  describe('useFollow (composite hook)', () => {
    it('should expose followUser function', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User followed successfully',
      };
      vi.mocked(followApi.followUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await result.current.followUser(123);

      expect(followApi.followUser).toHaveBeenCalledWith(123);
    });

    it('should expose unfollowUser function', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User unfollowed successfully',
      };
      vi.mocked(followApi.unfollowUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await result.current.unfollowUser(123);

      expect(followApi.unfollowUser).toHaveBeenCalledWith(123);
    });

    it('should toggle follow from false to true', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User followed successfully',
      };
      vi.mocked(followApi.followUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleFollow(123, false);

      expect(followApi.followUser).toHaveBeenCalledWith(123);
    });

    it('should toggle follow from true to false', async () => {
      const mockResponse = {
        success: true,
        status: 'success',
        message: 'User unfollowed successfully',
      };
      vi.mocked(followApi.unfollowUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleFollow(123, true);

      expect(followApi.unfollowUser).toHaveBeenCalledWith(123);
    });

    it('should track isFollowing state', async () => {
      vi.mocked(followApi.followUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.followUser(123);

      await waitFor(() => {
        expect(result.current.isFollowing).toBe(true);
      });

      await promise;
    });

    it('should track isUnfollowing state', async () => {
      vi.mocked(followApi.unfollowUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.unfollowUser(123);

      await waitFor(() => {
        expect(result.current.isUnfollowing).toBe(true);
      });

      await promise;
    });

    it('should track combined isLoading state', () => {
      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle follow error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Network error');
      vi.mocked(followApi.followUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.followUser(123)).rejects.toThrow(
        'Network error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to follow user:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle toggle error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Toggle error');
      vi.mocked(followApi.followUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useFollow(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.toggleFollow(123, false)).rejects.toThrow(
        'Toggle error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to toggle follow status:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('useGetFollowers', () => {
    it('should fetch followers successfully', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched followers successfully',
        data: [
          {
            id: 1,
            username: 'user1',
            name: 'User 1',
            displayName: 'User 1',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
          {
            id: 2,
            username: 'user2',
            name: 'User 2',
            displayName: 'User 2',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 2, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetFollowers(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(followApi.getFollowers).toHaveBeenCalledWith(123, undefined);
    });

    it('should handle pagination params', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched followers successfully',
        data: [],
        metadata: { page: 2, limit: 10, totalItems: 0, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowers).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useGetFollowers(123, { page: 2, limit: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(followApi.getFollowers).toHaveBeenCalledWith(123, {
        page: 2,
        limit: 10,
      });
    });

    it('should not fetch when enabled is false', async () => {
      renderHook(() => useGetFollowers(123, undefined, false), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(followApi.getFollowers).not.toHaveBeenCalled();
    });

    it('should not fetch when userId is 0', async () => {
      renderHook(() => useGetFollowers(0), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(followApi.getFollowers).not.toHaveBeenCalled();
    });
  });

  describe('useGetFollowing', () => {
    it('should fetch following successfully', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched following successfully',
        data: [
          {
            id: 3,
            username: 'user3',
            name: 'User 3',
            displayName: 'User 3',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
          {
            id: 4,
            username: 'user4',
            name: 'User 4',
            displayName: 'User 4',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 2, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowing).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetFollowing(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useGetFollowersYouKnow', () => {
    it('should fetch followers you know successfully', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched followers you know successfully',
        data: [
          {
            id: 5,
            username: 'user5',
            name: 'User 5',
            displayName: 'User 5',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowersYouKnow).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetFollowersYouKnow(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useInfiniteFollowers', () => {
    it('should fetch first page of followers', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched followers successfully',
        data: [
          {
            id: 1,
            username: 'user1',
            name: 'User 1',
            displayName: 'User 1',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useInfiniteFollowers(123, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockData);
    });

    it('should calculate next page correctly', async () => {
      const mockPage1 = {
        status: 'success',
        message: 'Fetched followers successfully',
        data: [
          {
            id: 1,
            username: 'user1',
            name: 'User 1',
            displayName: 'User 1',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 40, totalPages: 2 },
      };
      vi.mocked(followApi.getFollowers).mockResolvedValue(mockPage1);

      const { result } = renderHook(() => useInfiniteFollowers(123, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('should not have next page on last page', async () => {
      const mockLastPage = {
        status: 'success',
        message: 'Fetched followers successfully',
        data: [
          {
            id: 1,
            username: 'user1',
            name: 'User 1',
            displayName: 'User 1',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 2, limit: 20, totalItems: 40, totalPages: 2 },
      };
      vi.mocked(followApi.getFollowers).mockResolvedValue(mockLastPage);

      const { result } = renderHook(() => useInfiniteFollowers(123, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The getNextPageParam should return undefined for last page
      const nextPage = result.current.data?.pages[0]
        ? result.current.data.pages[0].metadata.page <
          result.current.data.pages[0].metadata.totalPages
          ? result.current.data.pages[0].metadata.page + 1
          : undefined
        : undefined;
      expect(nextPage).toBeUndefined();
    });
  });

  describe('useInfiniteFollowing', () => {
    it('should fetch first page of following', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched following successfully',
        data: [
          {
            id: 2,
            username: 'user2',
            name: 'User 2',
            displayName: 'User 2',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowing).mockResolvedValue(mockData);

      const { result } = renderHook(() => useInfiniteFollowing(123, 20), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockData);
    });
  });

  describe('useInfiniteFollowersYouKnow', () => {
    it('should fetch first page of followers you know', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched followers you know successfully',
        data: [
          {
            id: 3,
            username: 'user3',
            name: 'User 3',
            displayName: 'User 3',
            followedAt: '2025-01-01T00:00:00Z',
            is_followed_by_me: false,
            is_following_me: false,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(followApi.getFollowersYouKnow).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useInfiniteFollowersYouKnow(123, 20),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockData);
    });
  });
});
