import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock react-query
const mockQueryClient = {
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
  cancelQueries: vi.fn(),
  refetchQueries: vi.fn(),
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

// Mock tweet store
vi.mock('@/features/tweets/store/tweetStore', () => ({
  useTweetStore: vi.fn(() => ({})),
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

describe('RealTimeTweet optimistics', () => {
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

  describe('useRealTimeTweet', () => {
    it('should return onMutate function', () => {
      const { result } = renderHook(() => useRealTimeTweet());
      expect(result.current.onMutate).toBeDefined();
      expect(typeof result.current.onMutate).toBe('function');
    });

    it('should call onMutate with correct parameters', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      const response = await result.current.onMutate('LIKE', 1, 1, 10);

      expect(response).toHaveProperty('previousFeeds');
      expect(response).toHaveProperty('oldTweet');
    });

    it('should handle REPOST type', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      const response = await result.current.onMutate('REPOST', 1, 1, 5);

      expect(response).toBeDefined();
    });

    it('should handle REPLY type', async () => {
      const { result } = renderHook(() => useRealTimeTweet());

      // Just test that onMutate can be called with REPLY type
      const response = await result.current.onMutate(
        'REPLY',
        1,
        1,
        3,
        'POST',
        2
      );

      expect(response).toBeDefined();
    });
  });
});
