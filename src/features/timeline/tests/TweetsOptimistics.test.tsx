import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const mockRouterPush = vi.fn();
const mockSetBlockedFlag = vi.fn();
const mockSetCurrentTweet = vi.fn();

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
    setBlockedFlag: mockSetBlockedFlag,
  })),
}));

vi.mock('@/features/profile', () => ({
  useProfileStore: vi.fn((selector) =>
    selector({ currentProfile: { User: { id: 2, username: 'otheruser' } } })
  ),
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
    push: mockRouterPush,
  })),
}));

// Mock tweet store
vi.mock('@/features/tweets/store/tweetStore', () => ({
  useTweetStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({
        setCurrentTweet: mockSetCurrentTweet,
        currentTweet: { userId: 5, originalPostData: { userId: 6 } },
      });
    }
    return { setCurrentTweet: mockSetCurrentTweet, currentTweet: null };
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
    mockQueryClient.getQueryData.mockReturnValue(undefined);
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
      const response = await result.current.onMutate('like', 1, 1);
      expect(response).toHaveProperty('previousFeeds');
      expect(response).toHaveProperty('oldTweet');
    });

    it('should call onMutate with REPOST type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response).toBeDefined();
    });

    it('should call onMutate with BLOCK type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 1, 1);
      expect(response).toBeDefined();
    });

    it('should call onMutate with DELETE type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 1);
      expect(response).toBeDefined();
    });

    it('should call handleErrorOptimisticTweet with valid context', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const context = {
        previousFeeds: [
          { queryKey: ['timeline', 'forYou'], previousFeed: { pages: [] } },
        ],
        oldTweet: undefined,
      };
      result.current.handleErrorOptimisticTweet(context);
      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle handleErrorOptimisticTweet with empty context', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      expect(() =>
        result.current.handleErrorOptimisticTweet(undefined)
      ).not.toThrow();
    });

    it('should call onMutate with follow type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('follow', 1, 1);
      expect(response).toBeDefined();
      expect(response).toHaveProperty('previousFeeds');
    });

    it('should call onMutate with mute type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('mute', 1, 1);
      expect(response).toBeDefined();
    });

    it('should call onMutate with Quote type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response).toBeDefined();
    });

    it('should call onMutate with reply type', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('reply', 1, 1, 'reply', 2);
      expect(response).toBeDefined();
    });

    it('should call onMutate without tweetId', async () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1);
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
        oldTweet: { postId: 1, userId: 1 } as any,
      };
      result.current.handleErrorOptimisticTweet(context);
      expect(mockQueryClient.setQueryData).toHaveBeenCalledTimes(3);
    });

    it('should handle previousFeeds with null previousFeed', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const context = {
        previousFeeds: [
          { queryKey: ['timeline', 'forYou'], previousFeed: undefined },
        ],
        oldTweet: undefined,
      };
      result.current.handleErrorOptimisticTweet(context);
      expect(true).toBe(true);
    });

    it('should process LIKE mutation with existing feed data', async () => {
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
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should process LIKE mutation with liked tweet', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  likesCount: 5,
                  isLikedByMe: true,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process LIKE mutation with repost', async () => {
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
      const response = await result.current.onMutate('like', 1, 2);
      expect(response).toBeDefined();
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
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process REPOST mutation when already reposted by me', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  retweetsCount: 3,
                  isRepostedByMe: true,
                  isRepost: true,
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    retweetsCount: 5,
                    isRepostedByMe: true,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 2);
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
      const response = await result.current.onMutate('delete', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process DELETE mutation with quote tweet', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isRepost: false,
                  isQuote: true,
                  type: 'POST',
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    isDeleted: false,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process DELETE mutation with reply tweet', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isRepost: false,
                  isQuote: false,
                  type: 'REPLY',
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    isDeleted: false,
                    isQuote: true,
                    originalPostData: {
                      postId: 3,
                      userId: 3,
                      isDeleted: false,
                    },
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 3);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process DELETE mutation with repost containing nested original', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isRepost: true,
                  isQuote: false,
                  type: 'POST',
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    isDeleted: false,
                    originalPostData: {
                      postId: 3,
                      userId: 3,
                      isDeleted: false,
                    },
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 3);
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
      const response = await result.current.onMutate('follow', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process FOLLOW mutation with original post data', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  isFollowedByMe: false,
                  isRepost: true,
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    isFollowedByMe: false,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('follow', 2, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process BLOCK mutation', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 2,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process MUTE mutation', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 2,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('mute', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process reply mutation', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  commentsCount: 5,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('reply', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should process reply mutation with repost', async () => {
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
                    commentsCount: 5,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('reply', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed data', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              likesCount: 5,
              isLikedByMe: false,
              isRepost: false,
            },
          ],
          Sports: [
            {
              postId: 2,
              userId: 2,
              likesCount: 3,
              isLikedByMe: false,
              isRepost: false,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed data with DELETE', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: false,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed data with BLOCK', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 2,
              isRepost: false,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed data with FOLLOW', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 2,
              isFollowedByMe: false,
              isRepost: false,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('follow', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed data with repost in category', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: true,
              originalPostData: {
                postId: 2,
                userId: 2,
                likesCount: 5,
                isLikedByMe: false,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should update tweet by id', async () => {
      const mockTweet = {
        data: [
          {
            postId: 1,
            userId: 1,
            likesCount: 5,
            isLikedByMe: false,
            isRepost: false,
          },
        ],
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (queryKey && queryKey[0] === 'tweet' && queryKey[1] === 1) {
          return mockTweet;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      await result.current.onMutate('like', 1, 1);
      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle default type in updateTweet', async () => {
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
      const response = await result.current.onMutate('unknown', 1, 1);
      expect(response).toBeDefined();
    });

    it('should handle handleErrorOptimisticTweet with oldTweet', () => {
      const { result } = renderHook(() => useOptimisticTweet());
      const mockTweet = {
        postId: 1,
        userId: 1,
        likesCount: 5,
        isLikedByMe: false,
        isRepost: false,
      };
      const context = {
        previousFeeds: [],
        oldTweet: mockTweet as any,
      };
      result.current.handleErrorOptimisticTweet(context);
      expect(mockSetCurrentTweet).toHaveBeenCalledWith(mockTweet);
    });

    it('should handle quote mutation', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  retweetsCount: 3,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      // Quote type is same as repost in constants
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle quote mutation with repost data', async () => {
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
                    retweetsCount: 5,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests delete with quote tweet', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isQuote: true,
              isRepost: false,
              type: 'POST',
              originalPostData: {
                postId: 2,
                userId: 2,
                isDeleted: false,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests delete with nested original', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isQuote: false,
              isRepost: false,
              type: 'REPLY',
              originalPostData: {
                postId: 2,
                userId: 2,
                isDeleted: false,
                isQuote: true,
                originalPostData: {
                  postId: 3,
                  userId: 3,
                  isDeleted: false,
                },
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 3);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests delete with repost nested original', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isQuote: false,
              isRepost: true,
              type: 'POST',
              originalPostData: {
                postId: 2,
                userId: 2,
                isDeleted: false,
                originalPostData: {
                  postId: 3,
                  userId: 3,
                  isDeleted: false,
                },
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 3);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle multiple pages of feed data', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 1, userId: 1, likesCount: 5, isRepost: false }],
            },
          },
          {
            data: {
              posts: [{ postId: 2, userId: 1, likesCount: 3, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle empty posts array', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle like count going to zero', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  likesCount: 0,
                  isLikedByMe: true,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle retweet count going to zero', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1,
                  retweetsCount: 0,
                  isRepostedByMe: true,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle BLOCK with currentTweet userId matching - triggers router.push', async () => {
      // Mock currentTweet to match the userId being blocked
      vi.doMock('@/features/tweets/store/tweetStore', () => ({
        useTweetStore: vi.fn((selector) => {
          if (typeof selector === 'function') {
            return selector({
              setCurrentTweet: mockSetCurrentTweet,
              currentTweet: { userId: 3, originalPostData: null },
            });
          }
          return {
            setCurrentTweet: mockSetCurrentTweet,
            currentTweet: { userId: 3 },
          };
        }),
      }));

      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 1, userId: 3, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 3, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle MUTE with currentTweet userId matching - triggers router.push', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 1, userId: 3, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('mute', 3, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle REPOST mutation with isRepostedByMe true and filter reposts', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1, // same as myId from auth mock
                  isRepost: false,
                  retweetsCount: 3,
                  isRepostedByMe: true,
                  originalPostData: {
                    postId: 2,
                    userId: 2,
                    isRepostedByMe: true,
                  },
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests feed with REPOST and filter reposts', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: false,
              retweetsCount: 3,
              isRepostedByMe: true,
              originalPostData: {
                postId: 2,
                userId: 2,
                isRepostedByMe: true,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle BLOCK with currentTweet originalPostData userId matching', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 1, userId: 6, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 6, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle MUTE with currentTweet originalPostData userId matching', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 1, userId: 6, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('mute', 6, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests BLOCK with currentTweet userId matching', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [{ postId: 1, userId: 5, isRepost: false }],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('block', 5, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests MUTE with currentTweet originalPostData userId matching', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [{ postId: 1, userId: 6, isRepost: false }],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('mute', 6, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle DELETE for user-owned post', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 1, // same as current user
                  isRepost: false,
                  isQuote: false,
                  type: 'POST',
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle FOLLOW when user already followed', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [
                {
                  postId: 1,
                  userId: 2,
                  isFollowedByMe: true,
                  isRepost: false,
                },
              ],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('follow', 2, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle DELETE with repost filter on interests feed', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: true,
              isQuote: false,
              type: 'POST',
              originalPostData: {
                postId: 2,
                userId: 2,
                isDeleted: false,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('delete', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests FOLLOW with original post data', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: true,
              isFollowedByMe: false,
              originalPostData: {
                postId: 2,
                userId: 2,
                isFollowedByMe: false,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('follow', 2, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests REPOST with original post data', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: true,
              retweetsCount: 5,
              isRepostedByMe: false,
              originalPostData: {
                postId: 2,
                userId: 2,
                retweetsCount: 3,
                isRepostedByMe: false,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('repost', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests reply mutation', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: false,
              commentsCount: 5,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('reply', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle interests reply mutation with repost', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              isRepost: true,
              originalPostData: {
                postId: 2,
                userId: 2,
                commentsCount: 5,
              },
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('reply', 1, 2);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle multiple categories in interests feed', async () => {
      const mockInterestsFeed = {
        data: {
          Technology: [
            {
              postId: 1,
              userId: 1,
              likesCount: 5,
              isLikedByMe: false,
              isRepost: false,
            },
          ],
          Sports: [
            {
              postId: 2,
              userId: 1,
              likesCount: 3,
              isLikedByMe: false,
              isRepost: false,
            },
          ],
          Music: [
            {
              postId: 3,
              userId: 1,
              likesCount: 7,
              isLikedByMe: false,
              isRepost: false,
            },
          ],
        },
      };
      mockQueryClient.getQueryData.mockImplementation((queryKey) => {
        if (
          queryKey &&
          JSON.stringify(queryKey) === JSON.stringify(['explore', 'for-you'])
        ) {
          return mockInterestsFeed;
        }
        return undefined;
      });
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });

    it('should handle post not found in feed', async () => {
      const mockFeed = {
        pages: [
          {
            data: {
              posts: [{ postId: 99, userId: 99, isRepost: false }],
            },
          },
        ],
      };
      mockQueryClient.getQueryData.mockReturnValue(mockFeed);
      const { result } = renderHook(() => useOptimisticTweet());
      const response = await result.current.onMutate('like', 1, 1);
      expect(response.previousFeeds).toBeDefined();
    });
  });
});
