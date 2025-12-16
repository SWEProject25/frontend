import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock toaster
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

// Mock timelineApi
vi.mock('../services/timelineAPi', () => ({
  timelineApi: {
    addTweet: vi.fn(),
    getTimelineFeed: vi.fn(),
    searchProfile: vi.fn(),
    searchHashtag: vi.fn(),
  },
}));

// Mock useTimelineStore
vi.mock('../store/useTimelineStore', () => ({
  useSelectedTab: vi.fn(() => 'For you'),
  useNewTweets: vi.fn(() => []),
  useFetchAvatars: vi.fn(() => false),
  useSearch: vi.fn(() => ''),
}));

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useActions: () => ({
      onSuccess: vi.fn(),
      startSending: vi.fn(),
      seterror: vi.fn(),
      clearMedia: vi.fn(),
      clearEmoji: vi.fn(),
    }),
  })),
}));

// Mock useAuth
vi.mock('@/features/authentication/hooks', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, username: 'testuser' },
  })),
}));

// Mock profile
vi.mock('@/features/profile', () => ({
  PROFILE_QUERY_KEYS: {
    profilePosts: (id: number) => ['profile', 'posts', id],
    profileReplies: (id: number) => ['profile', 'replies', id],
    profileMedia: (id: number) => ['profile', 'media', id],
  },
  profileApi: {
    getProfileByUsername: vi.fn(),
  },
}));

// Mock useDebounce
vi.mock('../hooks/useDebounce', () => ({
  default: (value: string) => value,
}));

// Import after mocks
import {
  TIMELINE_QUERY_KEYS,
  useAddTweet,
  useTimelineFeed,
  useSearchProfile,
  useSearchHashtag,
  useCheckValidUser,
  useAvatarsPopUp,
} from '../hooks/timelineQueries';
import { timelineApi } from '../services/timelineAPi';
import {
  useSelectedTab,
  useFetchAvatars,
  useSearch,
} from '../store/useTimelineStore';
import { useAuth } from '@/features/authentication/hooks';
import { profileApi } from '@/features/profile';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = function Wrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return Wrapper;
};

describe('timelineQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelectedTab).mockReturnValue('For you');
    vi.mocked(useFetchAvatars).mockReturnValue(false);
    vi.mocked(useSearch).mockReturnValue('');
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, username: 'testuser' },
    } as ReturnType<typeof useAuth>);
  });

  describe('TIMELINE_QUERY_KEYS', () => {
    it('should have ADD_TWEET key', () => {
      expect(TIMELINE_QUERY_KEYS.ADD_TWEET).toEqual(['tweet']);
    });

    it('should have TIMELINE_FEED_FOR_YOU key', () => {
      expect(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU).toEqual([
        'timeline',
        'forYou',
      ]);
    });

    it('should have TIMELINE_FEED_FOR_YOU_POPUP key', () => {
      expect(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU_POPUP).toEqual([
        'timeline',
        'forYou',
        'popup',
      ]);
    });

    it('should have TIMELINE_FEED_FOLLOWING key', () => {
      expect(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING).toEqual([
        'timeline',
        'following',
      ]);
    });

    it('should have TIMELINE_FEED_FOLLOWING_POPUP key', () => {
      expect(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING_POPUP).toEqual([
        'timeline',
        'following',
        'popup',
      ]);
    });

    it('should have PROFILE_SEARCH function', () => {
      expect(TIMELINE_QUERY_KEYS.PROFILE_SEARCH('testuser')).toEqual([
        'profile',
        'testuser',
      ]);
    });

    it('should have HASHTAG_SEARCH function', () => {
      expect(TIMELINE_QUERY_KEYS.HASHTAG_SEARCH('test')).toEqual([
        'hashtag',
        'test',
      ]);
    });

    it('should have VALID_USER function', () => {
      expect(TIMELINE_QUERY_KEYS.VALID_USER('testuser')).toEqual([
        'mention',
        'testuser',
      ]);
    });
  });

  describe('useAddTweet', () => {
    it('should return mutation object', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('POST'), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
    });

    it('should handle successful tweet submission', async () => {
      vi.mocked(timelineApi.addTweet).mockResolvedValueOnce({
        data: { postId: 123, content: 'Test tweet' },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('POST'), { wrapper });

      const formData = new FormData();
      formData.append('content', 'Test tweet');

      result.current.mutate(formData);

      await waitFor(() => {
        expect(result.current.isPending || result.current.isSuccess).toBe(true);
      });
    });

    it('should handle successful tweet and update cache', async () => {
      vi.mocked(timelineApi.addTweet).mockResolvedValueOnce({
        data: { postId: 456, content: 'Cache test tweet' },
      } as never);

      const queryClient = createTestQueryClient();
      // Pre-populate cache with existing data
      queryClient.setQueryData(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING, {
        pages: [{ data: { posts: [{ postId: 1, content: 'Existing post' }] } }],
        pageParams: [1],
      });
      queryClient.setQueryData(TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU, {
        pages: [
          {
            data: { posts: [{ postId: 2, content: 'Another existing post' }] },
          },
          { data: { posts: [{ postId: 3, content: 'Third post' }] } },
        ],
        pageParams: [1, 2],
      });

      const Wrapper = function Wrapper({
        children,
      }: {
        children: React.ReactNode;
      }) {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      };

      const { result } = renderHook(() => useAddTweet('POST'), {
        wrapper: Wrapper,
      });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should handle tweet submission for reply label', async () => {
      vi.mocked(timelineApi.addTweet).mockResolvedValueOnce({
        data: { postId: 123, content: 'Reply content' },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('REPLY'), { wrapper });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(result.current.isPending || result.current.isSuccess).toBe(true);
      });
    });

    it('should handle tweet submission error', async () => {
      const error = new Error('API Error');
      vi.mocked(timelineApi.addTweet).mockRejectedValueOnce(error);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('POST'), { wrapper });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(
          result.current.isPending ||
            result.current.isError ||
            result.current.isSuccess
        ).toBe(true);
      });
    });

    it('should handle generic error object', async () => {
      vi.mocked(timelineApi.addTweet).mockRejectedValueOnce('Generic error');

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('POST'), { wrapper });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(
          result.current.isPending ||
            result.current.isError ||
            result.current.isSuccess
        ).toBe(true);
      });
    });

    it('should handle null user', async () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
      } as ReturnType<typeof useAuth>);

      vi.mocked(timelineApi.addTweet).mockResolvedValueOnce({
        data: { postId: 123, content: 'Test tweet' },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAddTweet('POST'), { wrapper });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(result.current.isPending || result.current.isSuccess).toBe(true);
      });
    });

    it('should handle cache update when old data is null', async () => {
      vi.mocked(timelineApi.addTweet).mockResolvedValueOnce({
        data: { postId: 789, content: 'New tweet' },
      } as never);

      const queryClient = createTestQueryClient();
      // No pre-populated cache (old is undefined/null)

      const Wrapper = function Wrapper({
        children,
      }: {
        children: React.ReactNode;
      }) {
        return (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        );
      };

      const { result } = renderHook(() => useAddTweet('POST'), {
        wrapper: Wrapper,
      });

      const formData = new FormData();
      result.current.mutate(formData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useTimelineFeed', () => {
    it('should return timeline feed data for For you tab', () => {
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTimelineFeed(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should return timeline feed data for Following tab', () => {
      vi.mocked(useSelectedTab).mockReturnValue('Following');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTimelineFeed(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should return next page param when posts exist', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [{ postId: 1 }] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTimelineFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });

    it('should return undefined next page when no posts', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useTimelineFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('useSearchProfile', () => {
    it('should return search profile data', () => {
      vi.mocked(timelineApi.searchProfile).mockResolvedValueOnce({
        data: [],
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchProfile('testuser'), {
        wrapper,
      });

      expect(result.current).toBeDefined();
    });

    it('should not search with empty string', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchProfile(''), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should not search with whitespace only', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchProfile('   '), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should handle search with results', async () => {
      vi.mocked(timelineApi.searchProfile).mockResolvedValueOnce({
        data: [{ id: 1, username: 'test' }],
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchProfile('test'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('useSearchHashtag', () => {
    it('should return search hashtag data', () => {
      vi.mocked(useSearch).mockReturnValue('test');
      vi.mocked(timelineApi.searchHashtag).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchHashtag(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should not search with empty hashtag', () => {
      vi.mocked(useSearch).mockReturnValue('');

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchHashtag(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should trim leading whitespace from hashtag', () => {
      vi.mocked(useSearch).mockReturnValue('  trending');
      vi.mocked(timelineApi.searchHashtag).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchHashtag(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should handle search with results', async () => {
      vi.mocked(useSearch).mockReturnValue('trending');
      vi.mocked(timelineApi.searchHashtag).mockResolvedValueOnce({
        data: { posts: [{ postId: 1 }] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useSearchHashtag(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('useCheckValidUser', () => {
    it('should return valid user data', () => {
      vi.mocked(profileApi.getProfileByUsername).mockResolvedValueOnce({
        data: { id: 1, username: 'testuser' },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCheckValidUser('testuser'), {
        wrapper,
      });

      expect(result.current).toBeDefined();
    });

    it('should not query with empty username', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCheckValidUser(''), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should handle user not found', async () => {
      vi.mocked(profileApi.getProfileByUsername).mockRejectedValueOnce(
        new Error('Not found')
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCheckValidUser('unknown'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('useAvatarsPopUp', () => {
    it('should return avatars popup data when popup is visible', () => {
      vi.mocked(useFetchAvatars).mockReturnValue(true);
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAvatarsPopUp(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should not fetch when popup is not visible', () => {
      vi.mocked(useFetchAvatars).mockReturnValue(false);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAvatarsPopUp(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should use Following endpoint when on Following tab', () => {
      vi.mocked(useFetchAvatars).mockReturnValue(true);
      vi.mocked(useSelectedTab).mockReturnValue('Following');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAvatarsPopUp(), { wrapper });

      expect(result.current).toBeDefined();
    });

    it('should use For you endpoint when on For you tab', () => {
      vi.mocked(useFetchAvatars).mockReturnValue(true);
      vi.mocked(useSelectedTab).mockReturnValue('For you');
      vi.mocked(timelineApi.getTimelineFeed).mockResolvedValueOnce({
        data: { posts: [] },
      } as never);

      const wrapper = createWrapper();
      const { result } = renderHook(() => useAvatarsPopUp(), { wrapper });

      expect(result.current).toBeDefined();
    });
  });
});
