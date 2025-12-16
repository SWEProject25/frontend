import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock API_CONFIG first
vi.mock('@/lib/config', () => ({
  API_CONFIG: {
    baseUrl: 'http://localhost:3000',
    timeout: 5000,
  },
}));

// Mock toaster
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

// Mock react-query
const mockMutate = vi.fn();
const mockQueryClient = {
  refetchQueries: vi.fn(),
  invalidateQueries: vi.fn(),
  getQueryData: vi.fn(),
  setQueryData: vi.fn(),
};

vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(() => ({
    mutate: mockMutate,
    mutateAsync: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  })),
  useQuery: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
  useInfiniteQuery: vi.fn(() => ({
    data: { pages: [] },
    isLoading: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  })),
  useQueryClient: () => mockQueryClient,
}));

// Mock timelineApi
vi.mock('../services/timelineAPi', () => ({
  timelineApi: {
    addTweet: vi.fn(),
    getTimeline: vi.fn(),
    searchProfiles: vi.fn(),
    searchHashtags: vi.fn(),
    validateUser: vi.fn(),
    deleteTweet: vi.fn(),
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
    useTweetText: () => '',
    useMedia: () => [],
    usePoll: () => null,
  })),
}));

// Mock optimistics
vi.mock('../optimistics/Tweets', () => ({
  useOptimisticTweet: vi.fn(() => ({
    onMutate: vi.fn(),
    handleErrorOptimisticTweet: vi.fn(),
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
  default: vi.fn((value) => value),
}));

// Import after mocks
import {
  TIMELINE_QUERY_KEYS,
  useTimelineFeed,
  useSearchProfile,
  useSearchHashtag,
  useCheckValidUser,
  useAvatarsPopUp,
} from '../hooks/timelineQueries';

describe('timelineQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('useTimelineFeed', () => {
    it('should return timeline feed data', () => {
      const { result } = renderHook(() => useTimelineFeed());

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeDefined();
    });
  });

  describe('useSearchProfile', () => {
    it('should return search profile data', () => {
      const { result } = renderHook(() => useSearchProfile('testuser'));

      expect(result.current).toBeDefined();
    });
  });

  describe('useSearchHashtag', () => {
    it('should return search hashtag data', () => {
      const { result } = renderHook(() => useSearchHashtag());

      expect(result.current).toBeDefined();
    });
  });

  describe('useCheckValidUser', () => {
    it('should return valid user data', () => {
      const { result } = renderHook(() => useCheckValidUser('testuser'));

      expect(result.current).toBeDefined();
    });
  });

  describe('useAvatarsPopUp', () => {
    it('should return avatars popup data', () => {
      const { result } = renderHook(() => useAvatarsPopUp());

      expect(result.current).toBeDefined();
    });
  });
});
