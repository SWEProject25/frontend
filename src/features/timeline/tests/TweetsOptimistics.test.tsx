import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock react-query
const mockQueryClient = {
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  cancelQueries: vi.fn(),
  refetchQueries: vi.fn(),
  invalidateQueries: vi.fn(),
};

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => mockQueryClient,
}));

// Mock useTimelineStore
vi.mock('../store/useTimelineStore', () => ({
  useSelectedTab: vi.fn(() => 'For you'),
  useParentId: vi.fn(() => 1),
}));

// Mock useExploreStore
vi.mock('@/features/explore/store/useExploreStore', () => ({
  useSearch: vi.fn(() => ''),
  useSelectedSearchTab: vi.fn(() => 'top'),
  useInterest: vi.fn(() => ''),
  useSelectedInterestTab: vi.fn(() => 'top'),
}));

// Mock profile store
vi.mock('@/features/profile/store/profileStore', () => ({
  useSelectedTab: vi.fn(() => 'Posts'),
  useActions: vi.fn(() => ({
    setCurrentProfile: vi.fn(),
  })),
}));

vi.mock('@/features/profile', () => ({
  useProfileStore: vi.fn((selector) => selector({ currentProfile: null })),
  PROFILE_QUERY_KEYS: {
    profilePosts: (id: number) => ['profile', 'posts', id],
    profileReplies: (id: number) => ['profile', 'replies', id],
    profileLikes: (id: number) => ['profile', 'likes', id],
    profileMentions: (id: number) => ['profile', 'mentions', id],
    profileMedia: (id: number) => ['profile', 'media', id],
  },
}));

// Mock auth
vi.mock('@/features/authentication/hooks', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: 'testuser' },
  })),
}));

// Mock navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock tweet store
vi.mock('@/features/tweets/store/tweetStore', () => ({
  useTweetStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        setCurrentTweet: vi.fn(),
        currentTweet: null,
      });
    }
    return { setCurrentTweet: vi.fn(), currentTweet: null };
  }),
}));

// Mock tweet queries
vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
  TWEET_QUERY_KEYS: {
    tweetById: (id: number) => ['tweet', id],
    getRepliesByTweetId: (id: number) => ['tweet', 'replies', id],
  },
}));

// Mock explore queries
vi.mock('@/features/explore/hooks/exploreQueries', () => ({
  EXPLORE_QUERY_KEYS: {
    EXPLORE_FEED_FOR_YOU: ['explore', 'for-you'],
    EXPLORE_FEED_SEARCH_TOP: (search: string) => [
      'explore',
      'search',
      'top',
      search,
    ],
    EXPLORE_FEED_SEARCH_LATEST: (search: string) => [
      'explore',
      'search',
      'latest',
      search,
    ],
    EXPLORE_FEED_INTEREST: (interest: string, tab: string) => [
      'explore',
      'interest',
      interest,
      tab,
    ],
  },
}));

// Import after mocks
import {
  useTimelineQueryKey,
  useProfileQueryKey,
  useExploreQueryKey,
  useInterestQueryKey,
  useOptimisticTweet,
} from '../optimistics/Tweets';

describe('Tweets optimistics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTimelineQueryKey', () => {
    it('should return timeline query key', () => {
      const { result } = renderHook(() => useTimelineQueryKey());
      expect(result.current).toBeDefined();
    });
  });

  describe('useProfileQueryKey', () => {
    it('should return profile query key', () => {
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });
  });

  describe('useExploreQueryKey', () => {
    it('should return explore query key', () => {
      const { result } = renderHook(() => useExploreQueryKey());
      expect(result.current).toBeDefined();
    });
  });

  describe('useInterestQueryKey', () => {
    it('should return interest query key', () => {
      const { result } = renderHook(() => useInterestQueryKey());
      expect(result.current).toBeDefined();
    });
  });

  describe('useOptimisticTweet', () => {
    it('should return onMutate function', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      expect(result.current.onMutate).toBeDefined();
      expect(typeof result.current.onMutate).toBe('function');
    });

    it('should return handleErrorOptimisticTweet function', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      expect(result.current.handleErrorOptimisticTweet).toBeDefined();
      expect(typeof result.current.handleErrorOptimisticTweet).toBe('function');
    });

    it('should call onMutate with LIKE type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('LIKE', 1, 1);

      expect(response).toHaveProperty('previousFeeds');
      expect(response).toHaveProperty('oldTweet');
    });

    it('should call onMutate with REPOST type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('REPOST', 1, 1);

      expect(response).toBeDefined();
    });

    it('should call onMutate with BLOCK type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('BLOCK', 1, 1);

      expect(response).toBeDefined();
    });

    it('should call onMutate with DELETE type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('DELETE', 1, 1);

      expect(response).toBeDefined();
    });

    it('should call handleErrorOptimisticTweet with valid context', () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const context = {
        previousFeeds: [
          { queryKey: ['timeline', 'forYou'], previousFeed: { pages: [] } },
        ],
        oldTweet: null,
      };

      // Call handleErrorOptimisticTweet with proper context
      result.current.handleErrorOptimisticTweet(context);

      // Should not throw
      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle handleErrorOptimisticTweet with empty context', () => {
      const { result } = renderHook(() => useOptimisticTweet());

      // Call with undefined context should not throw
      expect(() =>
        result.current.handleErrorOptimisticTweet(undefined)
      ).not.toThrow();
    });

    it('should call onMutate with FOLLOW type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('FOLLOW', 1, 1);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('previousFeeds');
    });

    it('should call onMutate with MUTE type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('MUTE', 1, 1);

      expect(response).toBeDefined();
    });

    it('should call onMutate with Quote type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('Quote', 1, 1);

      expect(response).toBeDefined();
    });

    it('should call onMutate with REPLY type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('REPLY', 1, 1, 'reply', 2);

      expect(response).toBeDefined();
    });

    it('should call onMutate without tweetId', async () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('LIKE', 1);

      expect(response).toBeDefined();
    });

    it('should handle multiple previousFeeds in handleErrorOptimisticTweet', () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const context = {
        previousFeeds: [
          { queryKey: ['timeline', 'forYou'], previousFeed: { pages: [] } },
          { queryKey: ['timeline', 'following'], previousFeed: { pages: [] } },
          { queryKey: ['explore', 'for-you'], previousFeed: { data: {} } },
        ],
        oldTweet: { postId: 1, userId: 1 },
      };

      result.current.handleErrorOptimisticTweet(context);

      expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(3);
    });

    it('should handle previousFeeds with null previousFeed', () => {
      const { result } = renderHook(() => useOptimisticTweet());

      const context = {
        previousFeeds: [
          { queryKey: ['timeline', 'forYou'], previousFeed: null },
        ],
        oldTweet: null,
      };

      result.current.handleErrorOptimisticTweet(context);

      // Should not throw even with null previousFeed
      expect(true).toBe(true);
    });

    it('should process LIKE mutation with existing feed data', async () => {
      // Mock getQueryData to return mock feed data
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  likesCount: 5,
                  isLikedByMe: false,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);

      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('LIKE', 1, 1);

      expect(response.previousFeeds).toBeDefined();
      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should process REPOST mutation with existing feed data', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  retweetsCount: 3,
                  isRepostedByMe: false,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);

      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('REPOST', 1, 1);

      expect(response.previousFeeds).toBeDefined();
    });

    it('should process DELETE mutation with existing feed data', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);

      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('DELETE', 1, 1);

      expect(response.previousFeeds).toBeDefined();
    });

    it('should process FOLLOW mutation with user posts', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 2,
                  isFollowedByMe: false,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);

      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('FOLLOW', 2, 1);

      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle repost with original post data', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isRepost: true,
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    likesCount: 10,
                    isLikedByMe: false,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);

      const { result } = renderHook(() => useOptimisticTweet());

      const response = await result.current.onMutate('LIKE', 2, 2);

      expect(response).toBeDefined();
    });
  });
});
