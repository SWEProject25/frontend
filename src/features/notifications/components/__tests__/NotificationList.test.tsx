import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/test-utils';
import { NotificationList } from '../NotificationList';
import { useNotifications } from '../../hooks';
import { NotificationType } from '../../types';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the useInView hook
vi.mock('react-intersection-observer', () => ({
  useInView: vi.fn(() => ({
    ref: vi.fn(),
    inView: false,
  })),
}));

// Mock the hooks
vi.mock('../../hooks', () => ({
  useNotifications: vi.fn(),
  useMarkAsRead: vi.fn(() => ({ mutate: vi.fn() })),
}));

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
  postPreviewText: 'This is a test post',
};

describe('NotificationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    // Check for loading indicator (Loader component)
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render error state', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: 'Failed to fetch notifications' },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(
      screen.getByText('Failed to load notifications')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Failed to fetch notifications')
    ).toBeInTheDocument();
  });

  it('should render error state with default message when error message is missing', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(
      screen.getByText('Failed to load notifications')
    ).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render empty state with default message', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [{ data: [], metadata: {} }],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    expect(
      screen.getByText("When you get notifications, they'll show up here")
    ).toBeInTheDocument();
  });

  it('should render empty state with custom message', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [{ data: [], metadata: {} }],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList emptyMessage="No mentions yet" />);

    expect(screen.getByText('No mentions yet')).toBeInTheDocument();
  });

  it('should render notifications list', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('should render multiple notifications', () => {
    const mockNotification2 = {
      ...mockNotification,
      id: '2',
      actor: {
        ...mockNotification.actor,
        id: 3,
        username: 'anotheruser',
        displayName: 'Another User',
      },
    };

    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification, mockNotification2],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Another User')).toBeInTheDocument();
  });

  it('should show end of list indicator when there are no more pages', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    expect(
      screen.getByText("You've seen all notifications")
    ).toBeInTheDocument();
  });

  it('should handle notifications from multiple pages', () => {
    const mockNotification2 = { ...mockNotification, id: '2' };

    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification],
            metadata: {},
          },
          {
            data: [mockNotification2],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    // Both notifications should be rendered
    const testUserElements = screen.getAllByText('Test User');
    expect(testUserElements).toHaveLength(2);
  });

  it('should call fetchNextPage when scrolled to bottom and hasNextPage is true', async () => {
    const fetchNextPage = vi.fn();
    const { useInView } = await import('react-intersection-observer');

    // Mock inView to be true
    vi.mocked(useInView).mockReturnValue({
      ref: vi.fn(),
      inView: true,
      entry: undefined,
    } as any);

    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    } as any);

    render(<NotificationList />);

    await waitFor(() => {
      expect(fetchNextPage).toHaveBeenCalled();
    });
  });

  it('should show loading indicator while fetching next page', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [
          {
            data: [mockNotification],
            metadata: {},
          },
        ],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    } as any);

    render(<NotificationList />);

    // Should show loader for pagination
    const loaders = screen.getAllByTestId('loader');
    expect(loaders.length).toBeGreaterThanOrEqual(1);
  });

  it('should pass params to useNotifications hook', () => {
    vi.mocked(useNotifications).mockReturnValue({
      data: {
        pages: [{ data: [], metadata: {} }],
        pageParams: [],
      },
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const params = { include: 'MENTION' };
    render(<NotificationList params={params} />);

    expect(useNotifications).toHaveBeenCalledWith(params);
  });
});
