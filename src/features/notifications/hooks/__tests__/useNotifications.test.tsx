import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useUnreadNotifications,
} from '../useNotifications';
import { notificationsApi } from '../../api';
import { NotificationType } from '../../types';

// Mock the API
vi.mock('../../api', () => ({
  notificationsApi: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

const mockNotification = {
  id: '1',
  type: NotificationType.LIKE,
  recipientId: 1,
  actor: {
    id: 2,
    username: 'testuser',
    displayName: 'Test User',
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  isRead: false,
  createdAt: '2024-01-01T12:00:00Z',
  postId: 123,
  postPreviewText: 'Test post',
};

const mockNotificationsResponse = {
  data: [mockNotification],
  metadata: {
    totalItems: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
    unreadCount: 1,
  },
};

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should fetch notifications successfully', async () => {
    vi.mocked(notificationsApi.getNotifications).mockResolvedValue(
      mockNotificationsResponse
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages[0].data).toEqual([mockNotification]);
  });

  it('should handle API errors', async () => {
    vi.mocked(notificationsApi.getNotifications).mockRejectedValue(
      new Error('API Error')
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('API Error');
  });

  it('should pass params to API', async () => {
    vi.mocked(notificationsApi.getNotifications).mockResolvedValue(
      mockNotificationsResponse
    );

    renderHook(() => useNotifications({ include: 'MENTION' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(notificationsApi.getNotifications).toHaveBeenCalledWith(
        expect.objectContaining({
          include: 'MENTION',
        })
      );
    });
  });

  it('should handle pagination correctly', async () => {
    const page1Response = {
      data: [mockNotification],
      metadata: {
        totalItems: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
        unreadCount: 2,
      },
    };

    const page2Response = {
      data: [{ ...mockNotification, id: '2' }],
      metadata: {
        totalItems: 2,
        page: 2,
        limit: 1,
        totalPages: 2,
        unreadCount: 2,
      },
    };

    vi.mocked(notificationsApi.getNotifications)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useNotifications({ limit: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(true);

    // Fetch next page
    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should not have next page when on last page', async () => {
    const response = {
      data: [mockNotification],
      metadata: {
        totalItems: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
        unreadCount: 1,
      },
    };

    vi.mocked(notificationsApi.getNotifications).mockResolvedValue(response);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should flatten notifications from multiple pages', async () => {
    const page1 = {
      data: [mockNotification],
      metadata: {
        totalItems: 2,
        page: 1,
        limit: 1,
        totalPages: 2,
        unreadCount: 2,
      },
    };

    const page2 = {
      data: [{ ...mockNotification, id: '2' }],
      metadata: {
        totalItems: 2,
        page: 2,
        limit: 1,
        totalPages: 2,
        unreadCount: 2,
      },
    };

    vi.mocked(notificationsApi.getNotifications)
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useNotifications({ limit: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.fetchNextPage();

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    const allNotifications = result.current.data?.pages.flatMap((p) => p.data);
    expect(allNotifications).toHaveLength(2);
  });
});

describe('useUnreadNotifications', () => {
  it('should fetch only unread notifications', async () => {
    vi.mocked(notificationsApi.getNotifications).mockResolvedValue(
      mockNotificationsResponse
    );

    renderHook(() => useUnreadNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(notificationsApi.getNotifications).toHaveBeenCalledWith(
        expect.objectContaining({
          unreadOnly: true,
        })
      );
    });
  });
});

describe('useUnreadCount', () => {
  afterEach(() => {
    // Ensure fake timers are always cleaned up
    vi.useRealTimers();
  });

  it('should fetch unread count successfully', async () => {
    vi.mocked(notificationsApi.getUnreadCount).mockResolvedValue({
      unreadCount: 5,
    });

    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(5);
  });

  it('should handle API errors', async () => {
    vi.mocked(notificationsApi.getUnreadCount).mockRejectedValue(
      new Error('Failed to fetch count')
    );

    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('Failed to fetch count');
  });

  it('should pass filter params to API', async () => {
    vi.mocked(notificationsApi.getUnreadCount).mockResolvedValue({
      unreadCount: 3,
    });

    renderHook(() => useUnreadCount({ exclude: 'DM' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(notificationsApi.getUnreadCount).toHaveBeenCalledWith({
        exclude: 'DM',
      });
    });
  });
});

describe('useMarkAsRead', () => {
  it('should mark notification as read', async () => {
    const updatedNotification = { ...mockNotification, isRead: true };

    vi.mocked(notificationsApi.markAsRead).mockResolvedValue(
      updatedNotification
    );

    const { result } = renderHook(() => useMarkAsRead(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(notificationsApi.markAsRead).toHaveBeenCalledWith('1');
  });

  it('should handle API errors', async () => {
    vi.mocked(notificationsApi.markAsRead).mockRejectedValue(
      new Error('Failed to mark as read')
    );

    const { result } = renderHook(() => useMarkAsRead(), {
      wrapper: createWrapper(),
    });

    result.current.mutate('1');

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain('Failed to mark as read');
  });

  it('should update cache optimistically', async () => {
    vi.mocked(notificationsApi.markAsRead).mockResolvedValue({
      ...mockNotification,
      isRead: true,
    });

    const queryClient = createTestQueryClient();

    // Pre-populate cache
    queryClient.setQueryData(['notifications', 'list', undefined], {
      pages: [mockNotificationsResponse],
      pageParams: [1],
    });

    queryClient.setQueryData(['notifications', 'unread-count'], 1);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useMarkAsRead(), { wrapper });

    result.current.mutate('1');

    // Check optimistic update
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<any>([
        'notifications',
        'list',
        undefined,
      ]);
      expect(cachedData?.pages[0].data[0].isRead).toBe(true);
    });
  });
});

describe('useMarkAllAsRead', () => {
  it('should mark all notifications as read', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockResolvedValue({
      message: 'All notifications marked as read',
    });

    const { result } = renderHook(() => useMarkAllAsRead(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(notificationsApi.markAllAsRead).toHaveBeenCalled();
  });

  it('should handle API errors', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockRejectedValue(
      new Error('Failed to mark all as read')
    );

    const { result } = renderHook(() => useMarkAllAsRead(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toContain(
      'Failed to mark all as read'
    );
  });

  it('should update cache optimistically', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockResolvedValue({
      message: 'Success',
    });

    const queryClient = createTestQueryClient();

    // Pre-populate cache
    queryClient.setQueryData(['notifications', 'list', undefined], {
      pages: [
        {
          data: [mockNotification, { ...mockNotification, id: '2' }],
          metadata: { unreadCount: 2 },
        },
      ],
      pageParams: [1],
    });

    queryClient.setQueryData(['notifications', 'unread-count'], 2);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useMarkAllAsRead(), { wrapper });

    result.current.mutate();

    // Check optimistic update
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<any>([
        'notifications',
        'list',
        undefined,
      ]);
      expect(cachedData?.pages[0].data.every((n: any) => n.isRead)).toBe(true);
    });

    await waitFor(() => {
      const unreadCount = queryClient.getQueryData([
        'notifications',
        'unread-count',
      ]);
      expect(unreadCount).toBe(0);
    });
  });

  it('should handle API errors in mark all as read', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockRejectedValueOnce(
      new Error('Failed to mark notifications as read')
    );

    const queryClient = createTestQueryClient();

    const mockNotification = {
      id: '1',
      recipientId: 1,
      type: 'LIKE',
      actor: {
        id: 2,
        username: 'testuser',
        displayName: 'Test User',
      },
      isRead: false,
      createdAt: '2024-01-01T12:00:00Z',
    };

    queryClient.setQueryData(['notifications', 'list', undefined], {
      pages: [
        {
          data: [mockNotification],
          metadata: { unreadCount: 1 },
        },
      ],
      pageParams: [1],
    });

    queryClient.setQueryData(['notifications', 'unread-count'], 1);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useMarkAllAsRead(), { wrapper });

    result.current.mutate();

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify rollback happened
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<any>([
        'notifications',
        'list',
        undefined,
      ]);
      expect(cachedData?.pages[0].data[0].isRead).toBe(false);
    });

    await waitFor(() => {
      const unreadCount = queryClient.getQueryData([
        'notifications',
        'unread-count',
      ]);
      expect(unreadCount).toBe(1);
    });
  });

  it('should handle non-Error object in mark all as read', async () => {
    vi.mocked(notificationsApi.markAllAsRead).mockRejectedValueOnce(
      'String error message'
    );

    const queryClient = createTestQueryClient();

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useMarkAllAsRead(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
