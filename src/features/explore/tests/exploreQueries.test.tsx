import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useSelectedSearchTab: vi.fn(() => 'top'),
  useSearch: vi.fn(() => 'test query'),
  useSearchDate: vi.fn(() => ''),
  useSelectedTab: vi.fn(() => 'personalized'),
  useSelectedInterestTab: vi.fn(() => 'top'),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/explore'),
}));

// Mock the API
vi.mock('../services/exploreApi', () => ({
  exploreApi: {
    getSearchFeed: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        message: 'OK',
        data: {
          posts: [
            {
              userId: 1,
              postId: 1,
              date: '2024-01-01',
              text: 'Test tweet',
            },
          ],
        },
        metadata: {
          totalItems: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      })
    ),
    getForYouFeed: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        message: 'OK',
        data: {
          Technology: [
            {
              userId: 1,
              postId: 1,
              date: '2024-01-01',
              text: 'Tech tweet',
            },
          ],
        },
      })
    ),
    getTrendingFeed: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        data: {
          trending: [{ tag: '#test', totalPosts: 100 }],
        },
        metadata: {
          HashtagsCount: 1,
          limit: 10,
          category: 'general',
        },
      })
    ),
    getInterestFeed: vi.fn(() =>
      Promise.resolve({
        status: 'success',
        message: 'OK',
        data: {
          posts: [
            {
              userId: 1,
              postId: 1,
              date: '2024-01-01',
              text: 'Interest tweet',
            },
          ],
        },
      })
    ),
  },
}));

// Mock constants
vi.mock('../constants/tabs', () => ({
  FOR_YOU_TAB: 'personalized',
  TRENDING_TAB: 'general',
  TOP_TAB: 'top',
  NEWS_TAB: 'news',
  SPORTS_TAB: 'sports',
  ENTERTAINMENT_TAB: 'entertainment',
}));

vi.mock('../constants/api', () => ({
  EXPLORE_ENDPOINTS: {
    EXPLORE_FEED_SEARCH_HASHTAG: '/api/v1.0/posts/search/hashtag',
    EXPLORE_FEED_SEARCH_TWEETS: '/api/v1.0/posts/search',
    EXPLORE_FEED_FOR_YOU: '/api/v1.0/posts/explore/for-you',
    EXPLORE_FEED_INTEREST: '/api/v1.0/posts/timeline/explore/interests',
    EXPLORE_FEED_TRENDING: '/api/v1.0/hashtags/trending',
  },
}));

import {
  useExploreSearchFeed,
  useExplorePosts,
  useTrendingFeed,
  useExploreInterest,
  EXPLORE_QUERY_KEYS,
} from '../hooks/exploreQueries';
import {
  useSelectedSearchTab,
  useSearch,
  useSelectedTab,
} from '../store/useExploreStore';
import { usePathname } from 'next/navigation';
import { exploreApi } from '../services/exploreApi';

// Create wrapper for hooks
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
};

describe('exploreQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EXPLORE_QUERY_KEYS', () => {
    it('should generate correct search top key', () => {
      const key = EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP('test');
      expect(key).toEqual(['explore', 'top', 'test']);
    });

    it('should generate correct search latest key', () => {
      const key = EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST('test');
      expect(key).toEqual(['explore', 'latest', 'test']);
    });

    it('should have correct for you key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU).toEqual([
        'explore',
        'forYou',
      ]);
    });

    it('should generate correct interest key', () => {
      const key = EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST('tech', 'top');
      expect(key).toEqual(['explore', 'interest', 'tech', 'top']);
    });

    it('should have correct trending for you key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_FOR_YOU).toEqual([
        'explore',
        'trends',
        'forYou',
      ]);
    });

    it('should have correct trending key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_TRENDING).toEqual([
        'explore',
        'trends',
        'trending',
      ]);
    });

    it('should have correct sports key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_SPORTS).toEqual([
        'explore',
        'trends',
        'sports',
      ]);
    });

    it('should have correct news key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_NEWS).toEqual([
        'explore',
        'trends',
        'news',
      ]);
    });

    it('should have correct entertainment key', () => {
      expect(EXPLORE_QUERY_KEYS.EXPLORE_TRENDS_ENTERTAINMENT).toEqual([
        'explore',
        'trends',
        'entertainment',
      ]);
    });
  });

  describe('useExploreSearchFeed', () => {
    it('should return initial state', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreSearchFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading || result.current.data).toBeTruthy();
      });
    });

    it('should call API with correct parameters for search query', async () => {
      const wrapper = createWrapper();
      renderHook(() => useExploreSearchFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getSearchFeed).toHaveBeenCalled();
      });
    });

    it('should not fetch when search is empty', async () => {
      vi.mocked(useSearch).mockReturnValue('');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreSearchFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should detect hashtag search', async () => {
      vi.mocked(useSearch).mockReturnValue('#hashtag');
      const wrapper = createWrapper();
      renderHook(() => useExploreSearchFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getSearchFeed).toHaveBeenCalled();
      });
    });

    it('should use latest tab query key', async () => {
      vi.mocked(useSelectedSearchTab).mockReturnValue('latest');
      vi.mocked(useSearch).mockReturnValue('test');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreSearchFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading || result.current.data).toBeTruthy();
      });
    });
  });

  describe('useExplorePosts', () => {
    it('should return initial state', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('personalized');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExplorePosts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading || result.current.data).toBeTruthy();
      });
    });

    it('should call getForYouFeed API', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('personalized');
      const wrapper = createWrapper();
      renderHook(() => useExplorePosts(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getForYouFeed).toHaveBeenCalled();
      });
    });

    it('should not fetch when not on FOR_YOU_TAB', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('general');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExplorePosts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('useTrendingFeed', () => {
    it('should return initial state', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('general');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading || result.current.data).toBeTruthy();
      });
    });

    it('should call getTrendingFeed API', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('general');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getTrendingFeed).toHaveBeenCalled();
      });
    });

    it('should not fetch when not on explore path', async () => {
      vi.mocked(usePathname).mockReturnValue('/home');
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should use sports query key for sports tab', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('sports');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getTrendingFeed).toHaveBeenCalledWith('sports', 30);
      });
    });

    it('should use news query key for news tab', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('news');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getTrendingFeed).toHaveBeenCalledWith('news', 30);
      });
    });

    it('should use entertainment query key for entertainment tab', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('entertainment');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getTrendingFeed).toHaveBeenCalledWith(
          'entertainment',
          30
        );
      });
    });

    it('should use for you limit for FOR_YOU_TAB', async () => {
      vi.mocked(useSelectedTab).mockReturnValue('personalized');
      vi.mocked(usePathname).mockReturnValue('/explore');
      const wrapper = createWrapper();
      renderHook(() => useTrendingFeed(), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getTrendingFeed).toHaveBeenCalledWith(
          'personalized',
          5
        );
      });
    });
  });

  describe('useExploreInterest', () => {
    it('should return initial state', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreInterest('Technology'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading || result.current.data).toBeTruthy();
      });
    });

    it('should call getInterestFeed API', async () => {
      const wrapper = createWrapper();
      renderHook(() => useExploreInterest('Technology'), { wrapper });

      await waitFor(() => {
        expect(exploreApi.getInterestFeed).toHaveBeenCalled();
      });
    });

    it('should not fetch when interest is empty', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreInterest(''), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should not fetch when interest is whitespace', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useExploreInterest('   '), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });
});
