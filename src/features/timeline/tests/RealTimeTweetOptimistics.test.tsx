import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock react-query
const mockQueryClient = {
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  cancelQueries: vi.fn().mockResolvedValue(undefined),
  refetchQueries: vi.fn().mockResolvedValue(undefined),
};

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => mockQueryClient,
}));

// Mock useTimelineStore
vi.mock('../store/useTimelineStore', () => ({
  useSelectedTab: vi.fn(() => 'For you'),
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
  useRealTimeTweet,
} from '../optimistics/RealTimeTweet';
import { useSelectedTab } from '../store/useTimelineStore';
import {
  useSearch,
  useSelectedSearchTab,
  useInterest,
  useSelectedInterestTab,
} from '@/features/explore/store/useExploreStore';
import { useSelectedTab as useProfileSelectedTab } from '@/features/profile/store/profileStore';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks';
import { useProfileStore } from '@/features/profile';

describe('RealTimeTweet optimistics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelectedTab).mockReturnValue('For you');
    vi.mocked(useSearch).mockReturnValue('');
    vi.mocked(useSelectedSearchTab).mockReturnValue('top');
    vi.mocked(useInterest).mockReturnValue('');
    vi.mocked(useSelectedInterestTab).mockReturnValue('top');
    vi.mocked(useProfileSelectedTab).mockReturnValue('Posts');
    vi.mocked(usePathname).mockReturnValue('/home');
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, username: 'testuser' },
    } as ReturnType<typeof useAuth>);
    // Default mock for setQueryData that calls the updater function
    mockQueryClient.setQueryData.mockImplementation((key, updater) => {
      if (typeof updater === 'function') {
        return updater(null);
      }
      return updater;
    });
  });

  describe('useTimelineQueryKey', () => {
    it('should return For you query key when tab is For you', () => {
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      const { result } = renderHook(() => useTimelineQueryKey());
      expect(result.current).toEqual(['timeline', 'forYou']);
    });

    it('should return Following query key when tab is Following', () => {
      vi.mocked(useSelectedTab).mockReturnValue('Following');
      const { result } = renderHook(() => useTimelineQueryKey());
      expect(result.current).toEqual(['timeline', 'following']);
    });
  });

  describe('useProfileQueryKey', () => {
    it('should return profile posts key for Posts tab', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Posts');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should return profile replies key for Replies tab', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Replies');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should return profile likes key for Likes tab', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Likes');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should return profile mentions key for Mentions tab', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Mentions');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should return profile media key for Media tab', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Media');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should return posts key as default', () => {
      vi.mocked(useProfileSelectedTab).mockReturnValue('Unknown');
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should use profile user id when available', () => {
      vi.mocked(useProfileStore).mockImplementation((selector) =>
        selector({
          currentProfile: { User: { id: 999, username: 'profileuser' } },
        } as never)
      );
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should fallback to myProfile when no profile user', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { id: 5, username: 'myuser' },
      } as ReturnType<typeof useAuth>);
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });

    it('should use -1 when no user available', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
      } as ReturnType<typeof useAuth>);
      vi.mocked(useProfileStore).mockImplementation((selector) =>
        selector({ currentProfile: null } as never)
      );
      const { result } = renderHook(() => useProfileQueryKey());
      expect(result.current).toBeDefined();
    });
  });

  describe('useExploreQueryKey', () => {
    it('should return for you key when no search', () => {
      vi.mocked(useSearch).mockReturnValue('');
      const { result } = renderHook(() => useExploreQueryKey());
      expect(result.current).toEqual(['explore', 'for-you']);
    });

    it('should return top search key when search and top tab', () => {
      vi.mocked(useSearch).mockReturnValue('test search');
      vi.mocked(useSelectedSearchTab).mockReturnValue('top');
      const { result } = renderHook(() => useExploreQueryKey());
      expect(result.current).toEqual([
        'explore',
        'search',
        'top',
        'test search',
      ]);
    });

    it('should return latest search key when search and latest tab', () => {
      vi.mocked(useSearch).mockReturnValue('test search');
      vi.mocked(useSelectedSearchTab).mockReturnValue('latest');
      const { result } = renderHook(() => useExploreQueryKey());
      expect(result.current).toEqual([
        'explore',
        'search',
        'latest',
        'test search',
      ]);
    });
  });

  describe('useInterestQueryKey', () => {
    it('should return interest query key', () => {
      vi.mocked(useInterest).mockReturnValue('technology');
      vi.mocked(useSelectedInterestTab).mockReturnValue('latest');
      const { result } = renderHook(() => useInterestQueryKey());
      expect(result.current).toEqual([
        'explore',
        'interest',
        'technology',
        'latest',
      ]);
    });
  });

  describe('useRealTimeTweet', () => {
    it('should return onMutate function', () => {
      const { result } = renderHook(() => useRealTimeTweet());
      expect(result.current.onMutate).toBeDefined();
      expect(typeof result.current.onMutate).toBe('function');
    });

    it('should call onMutate with LIKE type', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      const response = await result.current.onMutate('like', 1, 1, 10);

      expect(response).toHaveProperty('previousFeeds');
      expect(response).toHaveProperty('oldTweet');
    });

    it('should call onMutate with REPOST type', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      const response = await result.current.onMutate('repost', 1, 1, 5);

      expect(response).toBeDefined();
    });

    it('should call onMutate with REPLY type', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      const response = await result.current.onMutate(
        'reply',
        1,
        1,
        3,
        'POST',
        2
      );

      expect(response).toBeDefined();
      expect(mockQueryClient.refetchQueries).toHaveBeenCalled();
    });

    it('should update tweet by id when tweetId is valid and callback executes', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      // Mock setQueryData to execute the callback with proper data
      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [{ postId: 1, likesCount: 5, isRepost: false }],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle setQueryData callback with repost data', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [
              {
                postId: 1,
                isRepost: true,
                originalPostData: { postId: 100, likesCount: 5 },
              },
            ],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 100, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle setQueryData callback returning early when old is null', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          return updater(null);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should update repost type via callback', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [{ postId: 1, retweetsCount: 5, isRepost: false }],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('repost', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should update reply type via callback', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [{ postId: 1, commentsCount: 5, isRepost: false }],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('reply', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should update repost with originalPostData for repost type', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [
              {
                postId: 1,
                isRepost: true,
                originalPostData: { postId: 100, retweetsCount: 5 },
              },
            ],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('repost', 100, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should update repost with originalPostData for reply type', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [
              {
                postId: 1,
                isRepost: true,
                originalPostData: { postId: 100, commentsCount: 5 },
              },
            ],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('reply', 100, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle default case in updateTweet', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [{ postId: 1, isRepost: false }],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('unknown_type', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle repost without originalPostData', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.setQueryData.mockImplementation((key, updater) => {
        if (typeof updater === 'function') {
          const oldData = {
            data: [{ postId: 1, isRepost: true, originalPostData: null }],
          };
          return updater(oldData);
        }
        return updater;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should not update when old data is null', async () => {
      mockQueryClient.getQueryData.mockReturnValue(null);

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should use profile path query key', async () => {
      vi.mocked(usePathname).mockReturnValue('/testuser');
      vi.mocked(useProfileStore).mockImplementation((selector) =>
        selector({
          currentProfile: { User: { id: 1, username: 'testuser' } },
        } as never)
      );

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should use explore path query key', async () => {
      vi.mocked(usePathname).mockReturnValue('/explore');

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should use interest path query key', async () => {
      vi.mocked(usePathname).mockReturnValue('/explore/technology');

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should handle reply postType', async () => {
      vi.mocked(usePathname).mockReturnValue('/home');

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10, 'reply', 5);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should handle optimisticsInterests for explore for you', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key) === JSON.stringify(['explore', 'for-you'])) {
          return {
            data: {
              category1: [{ postId: 1, isRepost: false, likesCount: 5 }],
            },
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle optimisticsTabs with infinite data', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key).includes('timeline')) {
          return {
            pages: [
              {
                data: {
                  posts: [
                    { postId: 1, isRepost: false, likesCount: 5, userId: 1 },
                  ],
                },
              },
            ],
            pageParams: [1],
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle infinite data with repost', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key).includes('timeline')) {
          return {
            pages: [
              {
                data: {
                  posts: [
                    {
                      postId: 2,
                      isRepost: true,
                      originalPostData: { postId: 1, likesCount: 5 },
                      userId: 1,
                    },
                  ],
                },
              },
            ],
            pageParams: [1],
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle interests data with repost', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key) === JSON.stringify(['explore', 'for-you'])) {
          return {
            data: {
              category1: [
                {
                  postId: 2,
                  isRepost: true,
                  originalPostData: { postId: 1, likesCount: 5 },
                  userId: 1,
                },
              ],
            },
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle multiple pages in infinite data', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key).includes('timeline')) {
          return {
            pages: [
              {
                data: {
                  posts: [
                    { postId: 1, isRepost: false, likesCount: 5, userId: 1 },
                  ],
                },
              },
              {
                data: {
                  posts: [
                    { postId: 1, isRepost: false, likesCount: 5, userId: 1 },
                  ],
                },
              },
            ],
            pageParams: [1, 2],
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle post not found in pages', async () => {
      mockQueryClient.getQueryData.mockImplementation((key) => {
        if (JSON.stringify(key).includes('timeline')) {
          return {
            pages: [
              {
                data: {
                  posts: [
                    { postId: 999, isRepost: false, likesCount: 5, userId: 1 },
                  ],
                },
              },
            ],
            pageParams: [1],
          };
        }
        return null;
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should handle empty username fallback', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
      } as ReturnType<typeof useAuth>);
      vi.mocked(useProfileStore).mockImplementation((selector) =>
        selector({ currentProfile: null } as never)
      );

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('like', 1, 1, 10);

      expect(mockQueryClient.cancelQueries).toHaveBeenCalled();
    });

    it('should update repost type without originalPostData', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.getQueryData.mockReturnValue({
        data: [{ postId: 1, isRepost: false, retweetsCount: 5 }],
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('repost', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });

    it('should update reply type without originalPostData', async () => {
      // Mock path to be a full tweet view
      vi.mocked(usePathname).mockReturnValue('/home/1');

      mockQueryClient.getQueryData.mockReturnValue({
        data: [{ postId: 1, isRepost: false, commentsCount: 5 }],
      });

      const { result } = renderHook(() => useRealTimeTweet());
      await result.current.onMutate('reply', 1, 1, 10);

      expect(mockQueryClient.setQueryData).toHaveBeenCalled();
    });
  });
});
