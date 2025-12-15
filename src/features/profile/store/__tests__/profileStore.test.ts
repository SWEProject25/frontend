import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfileStore, useSelectedTab, useActions } from '../profileStore';
import { POSTS_TAB, REPLIES_TAB, MEDIA_TAB } from '../../constants/tabs';

describe('profileStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useProfileStore());
    act(() => {
      result.current.clearProfile();
      result.current.actions.selectTab(POSTS_TAB);
    });
  });

  describe('State Management', () => {
    it('should have initial state', () => {
      const { result } = renderHook(() => useProfileStore());

      expect(result.current.currentProfile).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedTab).toBe(POSTS_TAB);
    });

    it('should set current profile', () => {
      const { result } = renderHook(() => useProfileStore());
      const mockProfile = {
        id: 1,
        user_id: 1,
        name: 'Test User',
        bio: 'Test bio',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2020-01-01',
        },
      } as any;

      act(() => {
        result.current.setCurrentProfile(mockProfile);
      });

      expect(result.current.currentProfile).toEqual(mockProfile);
      expect(result.current.error).toBeNull();
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useProfileStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error state', () => {
      const { result } = renderHook(() => useProfileStore());
      const errorMessage = 'Failed to load profile';

      act(() => {
        result.current.setError(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear profile and reset state', () => {
      const { result } = renderHook(() => useProfileStore());
      const mockProfile = {
        id: 1,
        user_id: 1,
        name: 'Test User',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2020-01-01',
        },
      } as any;

      act(() => {
        result.current.setCurrentProfile(mockProfile);
        result.current.setLoading(true);
        result.current.setError('Some error');
      });

      expect(result.current.currentProfile).toEqual(mockProfile);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearProfile();
      });

      expect(result.current.currentProfile).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Tab Selection', () => {
    it('should select tab', () => {
      const { result } = renderHook(() => useProfileStore());

      act(() => {
        result.current.actions.selectTab(REPLIES_TAB);
      });

      expect(result.current.selectedTab).toBe(REPLIES_TAB);

      act(() => {
        result.current.actions.selectTab(MEDIA_TAB);
      });

      expect(result.current.selectedTab).toBe(MEDIA_TAB);
    });
  });

  describe('Selector Hooks', () => {
    it('useSelectedTab should return selected tab', () => {
      const { result: storeResult } = renderHook(() => useProfileStore());
      const { result: tabResult } = renderHook(() => useSelectedTab());

      expect(tabResult.current).toBe(POSTS_TAB);

      act(() => {
        storeResult.current.actions.selectTab(REPLIES_TAB);
      });

      const { result: newTabResult } = renderHook(() => useSelectedTab());
      expect(newTabResult.current).toBe(REPLIES_TAB);
    });

    it('useActions should return actions', () => {
      const { result } = renderHook(() => useActions());

      expect(result.current).toHaveProperty('selectTab');
      expect(typeof result.current.selectTab).toBe('function');
    });

    it('useActions selectTab should update selectedTab', () => {
      const { result: actionsResult } = renderHook(() => useActions());
      const { result: storeResult } = renderHook(() => useProfileStore());

      act(() => {
        actionsResult.current.selectTab(MEDIA_TAB);
      });

      expect(storeResult.current.selectedTab).toBe(MEDIA_TAB);
    });
  });

  describe('Complex State Changes', () => {
    it('should handle multiple state updates', () => {
      const { result } = renderHook(() => useProfileStore());
      const mockProfile = {
        id: 1,
        user_id: 1,
        name: 'Test User',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2020-01-01',
        },
      } as any;

      act(() => {
        result.current.setLoading(true);
        result.current.setCurrentProfile(mockProfile);
        result.current.actions.selectTab(REPLIES_TAB);
        result.current.setLoading(false);
      });

      expect(result.current.currentProfile).toEqual(mockProfile);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.selectedTab).toBe(REPLIES_TAB);
      expect(result.current.error).toBeNull();
    });

    it('should clear error when setting new profile', () => {
      const { result } = renderHook(() => useProfileStore());
      const mockProfile = {
        id: 1,
        user_id: 1,
        name: 'Test User',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2020-01-01',
        },
      } as any;

      act(() => {
        result.current.setError('Previous error');
      });

      expect(result.current.error).toBe('Previous error');

      act(() => {
        result.current.setCurrentProfile(mockProfile);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.currentProfile).toEqual(mockProfile);
    });
  });
});
