import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
}));

// Mock explore store
vi.mock('@/features/explore/store/useExploreStore', () => ({
  useSearchExplore: vi.fn(() => ''),
  useActions: vi.fn(() => ({
    setSearchQuery: vi.fn(),
  })),
}));

// Import after mocking
import {
  useSelectedTab,
  useActions,
  useSearchUser,
  useSearchIsopen,
  useNewTweets,
  usePopUpAvatars,
  useFetchAvatars,
  useTabsScroll,
  useParentId,
  usePostType,
  useShowCheckModal,
} from '../store/useTimelineStore';
import { FOLLOWING_TAB, FOR_YOU_TAB } from '../constants/menuName';
import { ADD_TWEET } from '../constants/tweetConstants';
import { TimelineFeed } from '../types/api';

const mockTweet: TimelineFeed = {
  userId: 1,
  username: 'testuser',
  verified: false,
  name: 'Test User',
  avatar: null,
  postId: 1,
  date: '2025-01-01T00:00:00.000Z',
  likesCount: 0,
  retweetsCount: 0,
  commentsCount: 0,
  isLikedByMe: false,
  isFollowedByMe: false,
  isRepostedByMe: false,
  text: 'Test tweet',
  mentions: [],
  media: [],
  isRepost: false,
  isQuote: false,
};

describe('useTimelineStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state hooks', () => {
    it('should have selectedTab hook', () => {
      const { result } = renderHook(() => useSelectedTab());
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should have searchUser hook', () => {
      const { result } = renderHook(() => useSearchUser());
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('string');
    });

    it('should have searchIsOpen hook', () => {
      const { result } = renderHook(() => useSearchIsopen());
      expect(typeof result.current).toBe('boolean');
    });

    it('should have newTweets hook', () => {
      const { result } = renderHook(() => useNewTweets());
      expect(Array.isArray(result.current)).toBe(true);
    });

    it('should have popUpAvatars hook', () => {
      const { result } = renderHook(() => usePopUpAvatars());
      expect(Array.isArray(result.current)).toBe(true);
    });

    it('should have fetchAvatars hook', () => {
      const { result } = renderHook(() => useFetchAvatars());
      expect(typeof result.current).toBe('boolean');
    });

    it('should have tabsScroll hook', () => {
      const { result } = renderHook(() => useTabsScroll());
      expect(Array.isArray(result.current)).toBe(true);
    });

    it('should have parentId hook', () => {
      const { result } = renderHook(() => useParentId());
      expect(typeof result.current).toBe('number');
    });

    it('should have postType hook', () => {
      const { result } = renderHook(() => usePostType());
      expect(typeof result.current).toBe('string');
    });

    it('should have showCheckModal hook', () => {
      const { result } = renderHook(() => useShowCheckModal());
      expect(typeof result.current).toBe('boolean');
    });
  });

  describe('useActions hook', () => {
    it('should return actions object', () => {
      const { result } = renderHook(() => useActions());
      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe('object');
    });

    it('should have selectTab action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.selectTab).toBe('function');
    });

    it('should have setSearchUser action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setSearchUser).toBe('function');
    });

    it('should have setSearchIsOpen action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setSearchIsOpen).toBe('function');
    });

    it('should have setNewTweets action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setNewTweets).toBe('function');
    });

    it('should have setPopUpAvatars action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setPopUpAvatars).toBe('function');
    });

    it('should have setFetchAvatars action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setFetchAvatars).toBe('function');
    });

    it('should have setTabsScroll action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setTabsScroll).toBe('function');
    });

    it('should have setParentId action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setParentId).toBe('function');
    });

    it('should have setPostType action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setPostType).toBe('function');
    });

    it('should have setShowCheckModal action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.setShowCheckModal).toBe('function');
    });

    it('should have addVisibleTweet action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.addVisibleTweet).toBe('function');
    });

    it('should have removeVisibleTweet action', () => {
      const { result } = renderHook(() => useActions());
      expect(typeof result.current.removeVisibleTweet).toBe('function');
    });
  });

  describe('action functionality', () => {
    it('selectTab should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.selectTab(FOR_YOU_TAB);
        });
      }).not.toThrow();
    });

    it('setSearchUser should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setSearchUser('testuser');
        });
      }).not.toThrow();
    });

    it('setSearchIsOpen should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setSearchIsOpen(true);
        });
      }).not.toThrow();
    });

    it('setNewTweets should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setNewTweets([mockTweet]);
        });
      }).not.toThrow();
    });

    it('setPopUpAvatars should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setPopUpAvatars([
            { avatar: '/test.jpg', name: 'Test' },
          ]);
        });
      }).not.toThrow();
    });

    it('setFetchAvatars should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setFetchAvatars(true);
        });
      }).not.toThrow();
    });

    it('setTabsScroll should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setTabsScroll([100, 200]);
        });
      }).not.toThrow();
    });

    it('setParentId should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setParentId(123);
        });
      }).not.toThrow();
    });

    it('setPostType should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setPostType(ADD_TWEET.REPLY);
        });
      }).not.toThrow();
    });

    it('setShowCheckModal should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.setShowCheckModal(false);
        });
      }).not.toThrow();
    });

    it('addVisibleTweet should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.addVisibleTweet(mockTweet);
        });
      }).not.toThrow();
    });

    it('removeVisibleTweet should be callable', () => {
      const { result } = renderHook(() => useActions());

      expect(() => {
        act(() => {
          result.current.removeVisibleTweet(mockTweet);
        });
      }).not.toThrow();
    });
  });

  describe('constants integration', () => {
    it('should use FOR_YOU_TAB constant', () => {
      expect(FOR_YOU_TAB).toBeDefined();
      expect(typeof FOR_YOU_TAB).toBe('string');
    });

    it('should use FOLLOWING_TAB constant', () => {
      expect(FOLLOWING_TAB).toBeDefined();
      expect(typeof FOLLOWING_TAB).toBe('string');
    });

    it('should use ADD_TWEET constants', () => {
      expect(ADD_TWEET).toBeDefined();
      expect(ADD_TWEET.POST).toBeDefined();
      expect(ADD_TWEET.REPLY).toBeDefined();
      expect(ADD_TWEET.QUOTE).toBeDefined();
    });
  });
});
