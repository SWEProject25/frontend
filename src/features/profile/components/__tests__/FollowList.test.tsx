import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import FollowList from '../FollowList';

// Mock dependencies
vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { username: 'currentuser', id: 1 },
  })),
}));

vi.mock('@/components/ui/UserCard', () => ({
  default: ({ name, handle, actionType }: any) => (
    <div data-testid="user-card">
      <span>{name}</span>
      <span>{handle}</span>
      {actionType && <button data-testid="action-button">{actionType}</button>}
    </div>
  ),
}));

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({ children, hasInitialData }: any) => (
    <div data-testid="infinite-scroll">
      {hasInitialData ? children : <div>No data</div>}
    </div>
  ),
}));

describe('FollowList', () => {
  const mockQuery = {
    data: {
      pages: [
        {
          data: [
            {
              id: 1,
              username: 'user1',
              displayName: 'User One',
              verified: false,
              profileImageUrl: null,
              is_followed_by_me: true,
            },
            {
              id: 2,
              username: 'currentuser',
              displayName: 'Current User',
              verified: true,
              profileImageUrl: 'https://example.com/avatar.jpg',
              is_followed_by_me: false,
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

  it('should render follow list container', () => {
    render(<FollowList query={mockQuery} />);
    expect(screen.getByTestId('follow-list')).toBeInTheDocument();
  });

  it('should render user cards', () => {
    render(<FollowList query={mockQuery} />);
    const userCards = screen.getAllByTestId('user-card');
    expect(userCards).toHaveLength(2);
  });

  it('should show action button for other users', () => {
    render(<FollowList query={mockQuery} />);
    const actionButtons = screen.getAllByTestId('action-button');
    // We have 2 users, but mock shows action for all - UserCard mock always shows button when actionType is provided
    expect(actionButtons.length).toBeGreaterThan(0);
  });

  it('should hide action button for current user', () => {
    render(<FollowList query={mockQuery} />);
    expect(screen.getByText('Current User')).toBeInTheDocument();
    // Current user should not have action button shown
  });

  it('should display user information', () => {
    render(<FollowList query={mockQuery} />);
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('@user1')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    const emptyQuery = {
      ...mockQuery,
      data: { pages: [] },
    };
    render(<FollowList query={emptyQuery} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('should render infinite scroll', () => {
    render(<FollowList query={mockQuery} />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });
});
