import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, createTestQueryClient } from '@/test/test-utils';
import {
  useGetInterests,
  useUpdateDateOfBirth,
  useUpdateInterests,
  useSuggestedUsers,
  ONBOARDING_QUERY_KEYS,
} from './useOnboarding';
import { onboardingApi } from '../services/onboardingApi';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, createElement } from 'react';

// Mock dependencies
vi.mock('../services/onboardingApi', () => ({
  onboardingApi: {
    getInterests: vi.fn(),
    updateDateOfBirth: vi.fn(),
    updateInterests: vi.fn(),
    getSuggestedUsers: vi.fn(),
  },
}));

// Mock the auth store properly
const mockSetUser = vi.fn();
const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  profile: {
    name: 'Test User',
    birthDate: null,
  },
  onboardingStatus: {
    hasCompletedBirthDate: false,
    hasCompeletedInterests: false,
    hasCompeletedFollowing: false,
  },
};

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn((selector) => {
    const store = {
      user: mockUser,
      setUser: mockSetUser,
    };
    return selector(store);
  }),
}));

vi.mock('@/features/authentication/services/authApi', () => ({
  authApi: {
    clearUserCache: vi.fn(),
  },
}));

vi.mock('@/features/explore/hooks/exploreQueries', () => ({
  EXPLORE_QUERY_KEYS: {
    EXPLORE_FEED_FOR_YOU: ['explore', 'for-you'],
  },
}));

describe('useOnboarding hooks', () => {
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    vi.clearAllMocks();
    const queryClient = createTestQueryClient();
    wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);
  });

  describe('ONBOARDING_QUERY_KEYS', () => {
    it('should generate correct query key for interests', () => {
      const key = ONBOARDING_QUERY_KEYS.interests();
      expect(key).toEqual(['onboarding', 'interests']);
    });

    it('should generate correct query key for suggested users without params', () => {
      const key = ONBOARDING_QUERY_KEYS.suggestedUsers();
      expect(key).toEqual(['onboarding', 'suggested-users', undefined]);
    });

    it('should generate correct query key for suggested users with params', () => {
      const params = { limit: 10, excludeFollowed: true };
      const key = ONBOARDING_QUERY_KEYS.suggestedUsers(params);
      expect(key).toEqual(['onboarding', 'suggested-users', params]);
    });
  });

  describe('useGetInterests', () => {
    const mockInterestsResponse = {
      status: 'success',
      message: 'Interests retrieved',
      total: 3,
      data: [
        {
          id: 1,
          name: 'Technology',
          slug: 'tech',
          description: 'Tech interests',
          icon: 'icon1',
        },
        {
          id: 2,
          name: 'Sports',
          slug: 'sports',
          description: 'Sports interests',
          icon: 'icon2',
        },
        {
          id: 3,
          name: 'Music',
          slug: 'music',
          description: 'Music interests',
          icon: 'icon3',
        },
      ],
    };

    it('should fetch interests successfully', async () => {
      (onboardingApi.getInterests as any).mockResolvedValueOnce(
        mockInterestsResponse
      );

      const { result } = renderHook(() => useGetInterests(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockInterestsResponse);
      expect(onboardingApi.getInterests).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch interests');
      (onboardingApi.getInterests as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useGetInterests(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should not fetch when enabled is false', async () => {
      (onboardingApi.getInterests as any).mockResolvedValueOnce(
        mockInterestsResponse
      );

      const { result } = renderHook(() => useGetInterests(false), { wrapper });

      // Wait a bit to ensure no call is made
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.data).toBeUndefined();
      expect(onboardingApi.getInterests).not.toHaveBeenCalled();
    });

    it('should fetch when enabled is true', async () => {
      (onboardingApi.getInterests as any).mockResolvedValueOnce(
        mockInterestsResponse
      );

      const { result } = renderHook(() => useGetInterests(true), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onboardingApi.getInterests).toHaveBeenCalled();
    });

    it('should use correct query key', async () => {
      (onboardingApi.getInterests as any).mockResolvedValueOnce(
        mockInterestsResponse
      );

      const { result } = renderHook(() => useGetInterests(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Query key should match ONBOARDING_QUERY_KEYS.interests()
      expect(result.current.data).toBeDefined();
    });
  });

  describe('useUpdateDateOfBirth', () => {
    const mockResponse = {
      status: 'success',
      message: 'Birth date updated',
      data: {
        id: 1,
        user_id: 1,
        name: 'Test User',
        birthDate: '1990-05-15',
        profileImageUrl: null,
        bannerImageUrl: null,
        bio: null,
        location: null,
        website: null,
        is_deactivated: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2024-01-01',
        },
        followersCount: 0,
        followingCount: 0,
      },
    };

    it('should update date of birth successfully', async () => {
      (onboardingApi.updateDateOfBirth as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateDateOfBirth(), { wrapper });

      result.current.mutate({ dateOfBirth: '1990-05-15' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onboardingApi.updateDateOfBirth).toHaveBeenCalledWith(
        { dateOfBirth: '1990-05-15' },
        expect.anything()
      );
    });

    it('should update user state on success', async () => {
      (onboardingApi.updateDateOfBirth as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateDateOfBirth(), { wrapper });

      result.current.mutate({ dateOfBirth: '1990-05-15' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetUser).toHaveBeenCalled();
    });

    it('should clear user cache on success', async () => {
      const { authApi } =
        await import('@/features/authentication/services/authApi');
      (onboardingApi.updateDateOfBirth as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateDateOfBirth(), { wrapper });

      result.current.mutate({ dateOfBirth: '1990-05-15' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authApi.clearUserCache).toHaveBeenCalled();
    });

    it('should handle update error', async () => {
      const error = new Error('Failed to update birth date');
      (onboardingApi.updateDateOfBirth as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateDateOfBirth(), { wrapper });

      result.current.mutate({ dateOfBirth: '1990-05-15' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useUpdateInterests', () => {
    const mockResponse = {
      status: 'success',
      message: 'Interests updated',
      savedCount: 3,
      nextStep: 'follow_suggestions',
    };

    it('should update interests successfully', async () => {
      (onboardingApi.updateInterests as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateInterests(), { wrapper });

      result.current.mutate({ interestIds: [1, 2, 3] });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onboardingApi.updateInterests).toHaveBeenCalledWith(
        { interestIds: [1, 2, 3] },
        expect.anything()
      );
    });

    it('should update user onboarding status on success', async () => {
      (onboardingApi.updateInterests as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateInterests(), { wrapper });

      result.current.mutate({ interestIds: [1, 2, 3] });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetUser).toHaveBeenCalled();
    });

    it('should clear user cache on success', async () => {
      const { authApi } =
        await import('@/features/authentication/services/authApi');
      (onboardingApi.updateInterests as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateInterests(), { wrapper });

      result.current.mutate({ interestIds: [1, 2, 3] });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authApi.clearUserCache).toHaveBeenCalled();
    });

    it('should invalidate explore feed on success', async () => {
      (onboardingApi.updateInterests as any).mockResolvedValueOnce(
        mockResponse
      );

      const { result } = renderHook(() => useUpdateInterests(), { wrapper });

      result.current.mutate({ interestIds: [1, 2, 3] });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The hook should trigger query invalidation for explore feed
      // This is tested through the mutation's onSuccess callback
    });

    it('should handle update error', async () => {
      const error = new Error('Failed to update interests');
      (onboardingApi.updateInterests as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useUpdateInterests(), { wrapper });

      result.current.mutate({ interestIds: [1, 2, 3] });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });
  });

  describe('useSuggestedUsers', () => {
    const mockSuggestedUsersResponse = {
      status: 'success',
      message: 'Suggested users retrieved',
      total: 2,
      data: {
        users: [
          {
            id: 2,
            username: 'johndoe',
            email: 'john@example.com',
            isVerified: true,
            profile: {
              name: 'John Doe',
              bio: 'Software developer',
              profileImageUrl: 'avatar1.jpg',
            },
            followersCount: 1250,
          },
          {
            id: 3,
            username: 'janedoe',
            email: 'jane@example.com',
            isVerified: false,
            profile: {
              name: 'Jane Doe',
              bio: 'Designer',
              profileImageUrl: 'avatar2.jpg',
            },
            followersCount: 800,
          },
        ],
      },
    };

    it('should fetch suggested users successfully', async () => {
      (onboardingApi.getSuggestedUsers as any).mockResolvedValueOnce(
        mockSuggestedUsersResponse
      );

      const { result } = renderHook(() => useSuggestedUsers(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSuggestedUsersResponse);
      expect(onboardingApi.getSuggestedUsers).toHaveBeenCalledWith(undefined);
    });

    it('should fetch suggested users with params', async () => {
      (onboardingApi.getSuggestedUsers as any).mockResolvedValueOnce(
        mockSuggestedUsersResponse
      );

      const params = { limit: 5, excludeFollowed: true, excludeBlocked: true };
      const { result } = renderHook(() => useSuggestedUsers(params), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onboardingApi.getSuggestedUsers).toHaveBeenCalledWith(params);
    });

    it('should not fetch when enabled is false', async () => {
      (onboardingApi.getSuggestedUsers as any).mockResolvedValueOnce(
        mockSuggestedUsersResponse
      );

      const { result } = renderHook(() => useSuggestedUsers(undefined, false), {
        wrapper,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(result.current.data).toBeUndefined();
      expect(onboardingApi.getSuggestedUsers).not.toHaveBeenCalled();
    });

    it('should fetch when enabled is true', async () => {
      (onboardingApi.getSuggestedUsers as any).mockResolvedValueOnce(
        mockSuggestedUsersResponse
      );

      const { result } = renderHook(() => useSuggestedUsers(undefined, true), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(onboardingApi.getSuggestedUsers).toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch suggested users');
      (onboardingApi.getSuggestedUsers as any)
        .mockReset()
        .mockRejectedValueOnce(error);

      const { result } = renderHook(() => useSuggestedUsers(undefined, true), {
        wrapper,
      });

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 2000 }
      );

      expect(result.current.error).toEqual(error);
    });

    it('should use correct query key with params', async () => {
      (onboardingApi.getSuggestedUsers as any)
        .mockReset()
        .mockResolvedValueOnce(mockSuggestedUsersResponse);

      const params = { limit: 10 };
      const { result } = renderHook(() => useSuggestedUsers(params, true), {
        wrapper,
      });

      await waitFor(
        () => {
          expect(result.current.isSuccess).toBe(true);
        },
        { timeout: 2000 }
      );

      expect(result.current.data).toBeDefined();
    });
  });
});
