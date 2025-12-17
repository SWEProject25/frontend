/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import WhoToFollow from '../components/WhoToFollow';

vi.mock('@/components/generic/Avatar', () => ({
  default: ({ src }: { src: string }) => <img src={src} alt="avatar" />,
}));

const mockUseSuggestedUsers = vi.fn();

vi.mock('../hooks/useSuggestedUsers', () => ({
  useSuggestedUsers: () => mockUseSuggestedUsers(),
}));

vi.mock('@/components/ui/UserCard', () => ({
  default: ({
    name,
    handle,
    verified,
    actionType,
  }: {
    name: string;
    handle: string;
    verified: boolean;
    actionType: string;
  }) => (
    <div data-testid="user-card">
      <span data-testid="user-name">{name}</span>
      <span data-testid="user-handle">{handle}</span>
      {verified && <span data-testid="verified-badge">Verified</span>}
      <button data-testid={`${actionType}-button`}>{actionType}</button>
    </div>
  ),
}));

describe('WhoToFollow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSuggestedUsers.mockReturnValue({
      data: { data: { users: [] } },
      isLoading: false,
    });
  });

  it('should render "Who to follow" heading', () => {
    render(<WhoToFollow />);
    expect(screen.getByText(/who to follow/i)).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const { container } = render(<WhoToFollow />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have proper container styling', () => {
    const { container } = render(<WhoToFollow />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('rounded-2xl');
  });

  it('should render loading state when isLoading is true', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<WhoToFollow />);
    expect(screen.getByText(/who to follow/i)).toBeInTheDocument();
    // Should not show empty message or users during loading
    expect(
      screen.queryByText(/no suggestions available/i)
    ).not.toBeInTheDocument();
  });

  it('should render suggested users', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'testuser',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'Test User',
                bio: 'Test bio',
                profileImageUrl: 'https://example.com/avatar.jpg',
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
    expect(screen.getByTestId('user-handle')).toHaveTextContent('@testuser');
  });

  it('should render multiple suggested users', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'user1',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'User One',
                bio: 'Bio 1',
                profileImageUrl: null,
              },
            },
            {
              id: 2,
              username: 'user2',
              isVerified: true,
              is_followed_by_me: false,
              profile: {
                name: 'User Two',
                bio: null,
                profileImageUrl: 'https://example.com/avatar2.jpg',
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    const userCards = screen.getAllByTestId('user-card');
    expect(userCards).toHaveLength(2);
  });

  it('should render empty state when no suggestions', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: { data: { users: [] } },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByText(/no suggestions available/i)).toBeInTheDocument();
  });

  it('should handle undefined data response', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByText(/no suggestions available/i)).toBeInTheDocument();
  });

  it('should handle null users array', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: { data: { users: null } },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByText(/no suggestions available/i)).toBeInTheDocument();
  });

  it('should render verified badge for verified users', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'verifieduser',
              isVerified: true,
              is_followed_by_me: false,
              profile: {
                name: 'Verified User',
                bio: 'Verified bio',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });

  it('should not render verified badge for non-verified users', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'normaluser',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'Normal User',
                bio: 'Normal bio',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
  });

  it('should render follow action type button', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'followuser',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'Follow User',
                bio: 'Follow bio',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('follow-button')).toBeInTheDocument();
  });

  it('should handle user with null profileImageUrl', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'noavatar',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'No Avatar User',
                bio: 'No avatar bio',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('No Avatar User');
  });

  it('should handle user with null bio', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'nobio',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'No Bio User',
                bio: null,
                profileImageUrl: 'https://example.com/avatar.jpg',
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('No Bio User');
  });

  it('should have border styling on container', () => {
    const { container } = render(<WhoToFollow />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('border');
    expect(mainContainer).toHaveClass('border-gray-700');
  });

  it('should have proper heading styling', () => {
    render(<WhoToFollow />);
    const heading = screen.getByText(/who to follow/i);
    expect(heading).toHaveClass('text-xl');
    expect(heading).toHaveClass('font-bold');
    expect(heading).toHaveClass('text-white');
  });

  it('should handle followed users correctly', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'followeduser',
              isVerified: false,
              is_followed_by_me: true,
              profile: {
                name: 'Followed User',
                bio: 'Already followed',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Followed User');
  });

  it('should render user handle with @ prefix', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: {
        data: {
          users: [
            {
              id: 1,
              username: 'handletest',
              isVerified: false,
              is_followed_by_me: false,
              profile: {
                name: 'Handle Test',
                bio: 'Testing handle',
                profileImageUrl: null,
              },
            },
          ],
        },
      },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByTestId('user-handle')).toHaveTextContent('@handletest');
  });

  it('should handle undefined data.data property', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: { data: undefined },
      isLoading: false,
    });
    render(<WhoToFollow />);
    expect(screen.getByText(/no suggestions available/i)).toBeInTheDocument();
  });

  it('should render empty state styling correctly', () => {
    mockUseSuggestedUsers.mockReturnValue({
      data: { data: { users: [] } },
      isLoading: false,
    });
    render(<WhoToFollow />);
    const emptyState = screen.getByText(/no suggestions available/i);
    expect(emptyState).toHaveClass('text-sm');
    expect(emptyState).toHaveClass('text-center');
  });
});
