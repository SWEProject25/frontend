import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useMute,
  useMuteUser,
  useUnmuteUser,
  useGetMutedUsers,
  useMutedUsers,
} from '../useMute';
import { muteApi } from '@/services/userInteractionsApi';
import React from 'react';

// Mock the API
vi.mock('@/services/userInteractionsApi', () => ({
  muteApi: {
    muteUser: vi.fn(),
    unmuteUser: vi.fn(),
    getMutedUsers: vi.fn(),
  },
}));

// Mock the optimistic tweet hook
vi.mock('@/features/timeline/optimistics/Tweets', () => ({
  useOptimisticTweet: () => ({
    onMutate: vi.fn(() => ({ previousData: 'mock' })),
    handleErrorOptimisticTweet: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const QueryWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  QueryWrapper.displayName = 'QueryWrapper';
  return QueryWrapper;
};

describe('useMute Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useMuteUser', () => {
    it('should successfully mute a user', async () => {
      const mockResponse = {
        success: true,
        message: 'User muted successfully',
      };
      vi.mocked(muteApi.muteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMuteUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(muteApi.muteUser).toHaveBeenCalledWith(123);
    });

    it('should handle mute error', async () => {
      const mockError = new Error('Failed to mute user');
      vi.mocked(muteApi.muteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMuteUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to mute user');
    });

    it('should handle generic error messages', async () => {
      vi.mocked(muteApi.muteUser).mockRejectedValue('String error');

      const { result } = renderHook(() => useMuteUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to mute user');
    });
  });

  describe('useUnmuteUser', () => {
    it('should successfully unmute a user', async () => {
      const mockResponse = {
        success: true,
        message: 'User unmuted successfully',
      };
      vi.mocked(muteApi.unmuteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUnmuteUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(muteApi.unmuteUser).toHaveBeenCalledWith(123);
    });

    it('should handle unmute error', async () => {
      const mockError = new Error('Failed to unmute user');
      vi.mocked(muteApi.unmuteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useUnmuteUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to unmute user');
    });
  });

  describe('useMute (composite hook)', () => {
    it('should expose muteUser function', async () => {
      const mockResponse = {
        success: true,
        message: 'User muted successfully',
      };
      vi.mocked(muteApi.muteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await result.current.muteUser(123);

      expect(muteApi.muteUser).toHaveBeenCalledWith(123);
    });

    it('should expose unmuteUser function', async () => {
      const mockResponse = {
        success: true,
        message: 'User unmuted successfully',
      };
      vi.mocked(muteApi.unmuteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await result.current.unmuteUser(123);

      expect(muteApi.unmuteUser).toHaveBeenCalledWith(123);
    });

    it('should toggle mute from false to true', async () => {
      const mockResponse = {
        success: true,
        message: 'User muted successfully',
      };
      vi.mocked(muteApi.muteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleMute(123, false);

      expect(muteApi.muteUser).toHaveBeenCalledWith(123);
    });

    it('should toggle mute from true to false', async () => {
      const mockResponse = {
        success: true,
        message: 'User unmuted successfully',
      };
      vi.mocked(muteApi.unmuteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleMute(123, true);

      expect(muteApi.unmuteUser).toHaveBeenCalledWith(123);
    });

    it('should track isMuting state', async () => {
      vi.mocked(muteApi.muteUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.muteUser(123);

      await waitFor(() => {
        expect(result.current.isMuting).toBe(true);
      });

      await promise;
    });

    it('should track isUnmuting state', async () => {
      vi.mocked(muteApi.unmuteUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.unmuteUser(123);

      await waitFor(() => {
        expect(result.current.isUnmuting).toBe(true);
      });

      await promise;
    });

    it('should track combined isLoading state', () => {
      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle mute error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Network error');
      vi.mocked(muteApi.muteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.muteUser(123)).rejects.toThrow(
        'Network error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to mute user:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle unmute error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Unmute error');
      vi.mocked(muteApi.unmuteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.unmuteUser(123)).rejects.toThrow(
        'Unmute error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to unmute user:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle toggle error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Toggle error');
      vi.mocked(muteApi.muteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.toggleMute(123, false)).rejects.toThrow(
        'Toggle error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to toggle mute status:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should expose error state from mutations', async () => {
      const mockError = new Error('Mute failed');
      vi.mocked(muteApi.muteUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.muteUser(123);
      } catch (e) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('should expose isSuccess state', async () => {
      const mockResponse = {
        success: true,
        message: 'User muted successfully',
      };
      vi.mocked(muteApi.muteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useMute(), {
        wrapper: createWrapper(),
      });

      await result.current.muteUser(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useGetMutedUsers', () => {
    it('should fetch muted users successfully', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched muted users successfully',
        data: [
          {
            id: 1,
            username: 'muted1',
            name: 'Muted User 1',
            displayName: 'Muted User 1',
            mutedAt: '2025-01-01T00:00:00Z',
            is_muted_by_me: true,
          },
          {
            id: 2,
            username: 'muted2',
            name: 'Muted User 2',
            displayName: 'Muted User 2',
            mutedAt: '2025-01-01T00:00:00Z',
            is_muted_by_me: true,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 2, totalPages: 1 },
      };
      vi.mocked(muteApi.getMutedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetMutedUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(muteApi.getMutedUsers).toHaveBeenCalledWith(undefined);
    });

    it('should handle pagination params', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched muted users successfully',
        data: [],
        metadata: { page: 2, limit: 10, totalItems: 0, totalPages: 1 },
      };
      vi.mocked(muteApi.getMutedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useGetMutedUsers({ page: 2, limit: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(muteApi.getMutedUsers).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
      });
    });

    it('should not fetch when enabled is false', async () => {
      renderHook(() => useGetMutedUsers(undefined, false), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(muteApi.getMutedUsers).not.toHaveBeenCalled();
    });

    it('should use correct staleTime', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched muted users successfully',
        data: [],
        metadata: { page: 1, limit: 20, totalItems: 0, totalPages: 1 },
      };
      vi.mocked(muteApi.getMutedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetMutedUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify staleTime is set (data should be fresh for 5 minutes)
      expect(result.current.isStale).toBe(false);
    });
  });

  describe('useMutedUsers (alias)', () => {
    it('should work as alias for useGetMutedUsers', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched muted users successfully',
        data: [
          {
            id: 1,
            username: 'muted1',
            name: 'Muted User 1',
            displayName: 'Muted User 1',
            mutedAt: '2025-01-01T00:00:00Z',
            is_muted_by_me: true,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(muteApi.getMutedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useMutedUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should respect enabled parameter', async () => {
      renderHook(() => useMutedUsers(undefined, false), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(muteApi.getMutedUsers).not.toHaveBeenCalled();
    });

    it('should pass pagination params correctly', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched muted users successfully',
        data: [],
        metadata: { page: 3, limit: 5, totalItems: 0, totalPages: 1 },
      };
      vi.mocked(muteApi.getMutedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useMutedUsers({ page: 3, limit: 5 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(muteApi.getMutedUsers).toHaveBeenCalledWith({ page: 3, limit: 5 });
    });
  });
});
