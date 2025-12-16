import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useBlock,
  useBlockUser,
  useUnblockUser,
  useGetBlockedUsers,
  useBlockedUsers,
} from '../useBlock';
import { blockApi } from '@/services/userInteractionsApi';
import React from 'react';

// Mock the API
vi.mock('@/services/userInteractionsApi', () => ({
  blockApi: {
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    getBlockedUsers: vi.fn(),
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
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientTestWrapper';
  return Wrapper;
};

describe('useBlock Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useBlockUser', () => {
    it('should successfully block a user', async () => {
      const mockResponse = {
        success: true,
        message: 'User blocked successfully',
      };
      vi.mocked(blockApi.blockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlockUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(blockApi.blockUser).toHaveBeenCalledWith(123);
    });

    it('should handle block error', async () => {
      const mockError = new Error('Failed to block user');
      vi.mocked(blockApi.blockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBlockUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to block user');
    });

    it('should handle generic error messages', async () => {
      vi.mocked(blockApi.blockUser).mockRejectedValue('String error');

      const { result } = renderHook(() => useBlockUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to block user');
    });
  });

  describe('useUnblockUser', () => {
    it('should successfully unblock a user', async () => {
      const mockResponse = {
        success: true,
        message: 'User unblocked successfully',
      };
      vi.mocked(blockApi.unblockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUnblockUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(blockApi.unblockUser).toHaveBeenCalledWith(123);
    });

    it('should handle unblock error', async () => {
      const mockError = new Error('Failed to unblock user');
      vi.mocked(blockApi.unblockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useUnblockUser(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(123);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to unblock user');
    });
  });

  describe('useBlock (composite hook)', () => {
    it('should expose blockUser function', async () => {
      const mockResponse = {
        success: true,
        message: 'User blocked successfully',
      };
      vi.mocked(blockApi.blockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await result.current.blockUser(123);

      expect(blockApi.blockUser).toHaveBeenCalledWith(123);
    });

    it('should expose unblockUser function', async () => {
      const mockResponse = {
        success: true,
        message: 'User unblocked successfully',
      };
      vi.mocked(blockApi.unblockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await result.current.unblockUser(123);

      expect(blockApi.unblockUser).toHaveBeenCalledWith(123);
    });

    it('should toggle block from false to true', async () => {
      const mockResponse = {
        success: true,
        message: 'User blocked successfully',
      };
      vi.mocked(blockApi.blockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleBlock(123, false);

      expect(blockApi.blockUser).toHaveBeenCalledWith(123);
    });

    it('should toggle block from true to false', async () => {
      const mockResponse = {
        success: true,
        message: 'User unblocked successfully',
      };
      vi.mocked(blockApi.unblockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await result.current.toggleBlock(123, true);

      expect(blockApi.unblockUser).toHaveBeenCalledWith(123);
    });

    it('should track isBlocking state', async () => {
      vi.mocked(blockApi.blockUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.blockUser(123);

      await waitFor(() => {
        expect(result.current.isBlocking).toBe(true);
      });

      await promise;
    });

    it('should track isUnblocking state', async () => {
      vi.mocked(blockApi.unblockUser).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      const promise = result.current.unblockUser(123);

      await waitFor(() => {
        expect(result.current.isUnblocking).toBe(true);
      });

      await promise;
    });

    it('should track combined isLoading state', () => {
      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle block error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Network error');
      vi.mocked(blockApi.blockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.blockUser(123)).rejects.toThrow(
        'Network error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to block user:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle unblock error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Unblock error');
      vi.mocked(blockApi.unblockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.unblockUser(123)).rejects.toThrow(
        'Unblock error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to unblock user:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle toggle error and log it', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockError = new Error('Toggle error');
      vi.mocked(blockApi.blockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await expect(result.current.toggleBlock(123, false)).rejects.toThrow(
        'Toggle error'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to toggle block status:',
        mockError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should expose error state from mutations', async () => {
      const mockError = new Error('Block failed');
      vi.mocked(blockApi.blockUser).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.blockUser(123);
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
        message: 'User blocked successfully',
      };
      vi.mocked(blockApi.blockUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useBlock(), {
        wrapper: createWrapper(),
      });

      await result.current.blockUser(123);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('useGetBlockedUsers', () => {
    it('should fetch blocked users successfully', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched blocked users successfully',
        data: [
          {
            id: 1,
            username: 'blocked1',
            name: 'Blocked User 1',
            displayName: 'Blocked User 1',
            blockedAt: '2025-01-01T00:00:00Z',
            is_blocked_by_me: true,
          },
          {
            id: 2,
            username: 'blocked2',
            name: 'Blocked User 2',
            displayName: 'Blocked User 2',
            blockedAt: '2025-01-01T00:00:00Z',
            is_blocked_by_me: true,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 2, totalPages: 1 },
      };
      vi.mocked(blockApi.getBlockedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useGetBlockedUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(blockApi.getBlockedUsers).toHaveBeenCalledWith(undefined);
    });

    it('should handle pagination params', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched blocked users successfully',
        data: [],
        metadata: { page: 2, limit: 10, totalItems: 0, totalPages: 1 },
      };
      vi.mocked(blockApi.getBlockedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useGetBlockedUsers({ page: 2, limit: 10 }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(blockApi.getBlockedUsers).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
      });
    });

    it('should not fetch when enabled is false', async () => {
      renderHook(() => useGetBlockedUsers(undefined, false), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(blockApi.getBlockedUsers).not.toHaveBeenCalled();
    });
  });

  describe('useBlockedUsers (alias)', () => {
    it('should work as alias for useGetBlockedUsers', async () => {
      const mockData = {
        status: 'success',
        message: 'Fetched blocked users successfully',
        data: [
          {
            id: 1,
            username: 'blocked1',
            name: 'Blocked User 1',
            displayName: 'Blocked User 1',
            blockedAt: '2025-01-01T00:00:00Z',
            is_blocked_by_me: true,
          },
        ],
        metadata: { page: 1, limit: 20, totalItems: 1, totalPages: 1 },
      };
      vi.mocked(blockApi.getBlockedUsers).mockResolvedValue(mockData);

      const { result } = renderHook(() => useBlockedUsers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
    });

    it('should respect enabled parameter', async () => {
      renderHook(() => useBlockedUsers(undefined, false), {
        wrapper: createWrapper(),
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(blockApi.getBlockedUsers).not.toHaveBeenCalled();
    });
  });
});
