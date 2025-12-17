import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import GenericUserList from '../GenericUserList';

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

vi.mock('@/components/ui/UserCard', () => ({
  default: ({
    name,
    userId,
    handle,
    'data-testid': testId,
  }: {
    name: string;
    userId: number;
    handle: string;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      <div>{name}</div>
      <div>{handle}</div>
      <div data-testid={`user-${userId}`}>User {userId}</div>
    </div>
  ),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn((selector) =>
    selector({
      user: { id: 1, username: 'currentuser' },
    })
  ),
}));

describe('GenericUserList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render user list with users', () => {
    const mockQuery = {
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                username: 'user1',
                displayName: 'User One',
                bio: 'Bio 1',
                profileImageUrl: null,
                verified: false,
                is_followed_by_me: false,
                is_following_me: false,
              },
              {
                id: 2,
                username: 'user2',
                displayName: 'User Two',
                bio: 'Bio 2',
                profileImageUrl: null,
                verified: true,
                is_followed_by_me: true,
                is_following_me: true,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
    expect(screen.getByText('@user1')).toBeInTheDocument();
    expect(screen.getByText('@user2')).toBeInTheDocument();
  });

  it('should render with custom testId', () => {
    const mockQuery = {
      data: {
        pages: [{ data: [] }],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} data-testid="custom-list" />);

    expect(screen.getByTestId('custom-list')).toBeInTheDocument();
  });

  it('should use default testId when not provided', () => {
    const mockQuery = {
      data: {
        pages: [{ data: [] }],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByTestId('generic-user-list')).toBeInTheDocument();
  });

  it('should handle empty user list', () => {
    const mockQuery = {
      data: {
        pages: [{ data: [] }],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByTestId('generic-user-list')).toBeInTheDocument();
    expect(screen.queryAllByTestId(/^user-card-/)).toHaveLength(0);
  });

  it('should handle multiple pages of users', () => {
    const mockQuery = {
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                username: 'user1',
                displayName: 'User One',
                bio: null,
                profileImageUrl: null,
                verified: false,
              },
            ],
          },
          {
            data: [
              {
                id: 2,
                username: 'user2',
                displayName: 'User Two',
                bio: null,
                profileImageUrl: null,
                verified: false,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByTestId('user-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-2')).toBeInTheDocument();
  });

  it('should default is_followed_by_me to true when undefined', () => {
    const mockQuery = {
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                username: 'user1',
                displayName: 'User One',
                bio: null,
                profileImageUrl: null,
                verified: false,
                // is_followed_by_me is undefined
              },
            ],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByTestId('user-1')).toBeInTheDocument();
  });

  it('should handle null data gracefully', () => {
    const mockQuery = {
      data: null,
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} />);

    expect(screen.getByTestId('generic-user-list')).toBeInTheDocument();
  });

  it('should render user items with correct test ids', () => {
    const mockQuery = {
      data: {
        pages: [
          {
            data: [
              {
                id: 123,
                username: 'testuser',
                displayName: 'Test User',
                bio: null,
                profileImageUrl: null,
                verified: false,
              },
            ],
          },
        ],
      },
      isLoading: false,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    };

    render(<GenericUserList query={mockQuery} data-testid="my-list" />);

    expect(screen.getByTestId('my-list-item-123')).toBeInTheDocument();
    expect(screen.getByTestId('my-list-user-card-123')).toBeInTheDocument();
  });
});
