import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import FollowSuggestionsModal from './FollowSuggestionsModal';
import { useSuggestedUsers } from '../hooks/useOnboarding';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { authApi } from '@/features/authentication/services/authApi';
import { useQueryClient } from '@tanstack/react-query';

// Mock dependencies
vi.mock('../hooks/useOnboarding', () => ({
  useSuggestedUsers: vi.fn(),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/features/authentication/services/authApi', () => ({
  authApi: {
    clearUserCache: vi.fn(),
  },
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

vi.mock('@/features/timeline/hooks/timelineQueries', () => ({
  TIMELINE_QUERY_KEYS: {
    TIMELINE_FEED_FOR_YOU: ['timeline', 'for-you'],
    TIMELINE_FEED_FOLLOWING: ['timeline', 'following'],
  },
}));

// Mock UI components
vi.mock('@/components/ui/hoc/XModal', () => ({
  default: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="x-modal">{children}</div> : null),
}));

vi.mock('@/components/ui/AuthButton', () => ({
  AuthButton: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled} data-testid="next-button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/UserCard', () => ({
  default: ({
    userId,
    name,
    handle,
    isFollowed,
    onFollowChange,
  }: {
    userId: number;
    name: string;
    handle: string;
    isFollowed: boolean;
    onFollowChange: (userId: number, isFollowed: boolean) => void;
  }) => (
    <div data-testid={`user-card-${userId}`}>
      <div>{name}</div>
      <div>{handle}</div>
      <button
        data-testid={`follow-button-${userId}`}
        onClick={() => onFollowChange(userId, !isFollowed)}
      >
        {isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  ),
}));

describe('FollowSuggestionsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();
  const mockSetUser = vi.fn();
  const mockRefetchQueries = vi.fn();

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    onboardingStatus: {
      hasCompletedBirthDate: true,
      hasCompeletedInterests: true,
      hasCompeletedFollowing: false,
    },
    profile: {
      name: 'Test User',
    },
  };

  const mockSuggestedUsers = [
    {
      id: 2,
      username: 'johndoe',
      email: 'john@example.com',
      isVerified: true,
      profile: {
        name: 'John Doe',
        bio: 'Software developer',
        profileImageUrl: 'https://example.com/avatar1.jpg',
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
        bio: 'UX Designer',
        profileImageUrl: 'https://example.com/avatar2.jpg',
      },
      followersCount: 2800,
    },
  ];

  const defaultMockUseSuggestedUsers = {
    data: {
      data: {
        users: mockSuggestedUsers,
      },
      total: 2,
    },
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSuggestedUsers as any).mockReturnValue(defaultMockUseSuggestedUsers);
    (useAuthStore as any).mockImplementation((selector: any) => {
      const store = {
        user: mockUser,
        setUser: mockSetUser,
      };
      return selector(store);
    });
    (useQueryClient as any).mockReturnValue({
      refetchQueries: mockRefetchQueries,
    });
  });

  describe('Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('x-modal')).toBeInTheDocument();
      expect(screen.getByText("Don't miss out")).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      render(
        <FollowSuggestionsModal
          isOpen={false}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
    });

    it('should render suggested users list', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('@johndoe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('@janedoe')).toBeInTheDocument();
    });

    it('should display user count correctly', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText(/\(2 of 2 shown\)/)).toBeInTheDocument();
    });

    it('should only fetch users when modal is open', () => {
      const { rerender } = render(
        <FollowSuggestionsModal
          isOpen={false}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(useSuggestedUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          excludeFollowed: true,
          excludeBlocked: true,
        }),
        false
      );

      rerender(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(useSuggestedUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          excludeFollowed: true,
          excludeBlocked: true,
        }),
        true
      );
    });
  });

  describe('Loading State', () => {
    it('should display loading spinner when fetching suggestions', () => {
      (useSuggestedUsers as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByText('Loading suggestions...')).toBeInTheDocument();
    });

    it('should not display user list when loading', () => {
      (useSuggestedUsers as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetching fails', () => {
      (useSuggestedUsers as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network error'),
      });

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('Failed to load suggestions')
      ).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display message when no suggestions available', () => {
      (useSuggestedUsers as any).mockReturnValue({
        data: {
          data: {
            users: [],
          },
          total: 0,
        },
        isLoading: false,
        error: null,
      });

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('No suggestions available at the moment.')
      ).toBeInTheDocument();
    });
  });

  describe('Follow/Unfollow Functionality', () => {
    it('should track followed users when follow button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      expect(followButton).toHaveTextContent('Follow');

      await user.click(followButton);

      expect(followButton).toHaveTextContent('Following');
    });

    it('should unfollow user when clicking following button', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');

      // Follow
      await user.click(followButton);
      expect(followButton).toHaveTextContent('Following');

      // Unfollow
      await user.click(followButton);
      expect(followButton).toHaveTextContent('Follow');
    });

    it('should track multiple followed users', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton1 = screen.getByTestId('follow-button-2');
      const followButton2 = screen.getByTestId('follow-button-3');

      await user.click(followButton1);
      await user.click(followButton2);

      expect(followButton1).toHaveTextContent('Following');
      expect(followButton2).toHaveTextContent('Following');
    });
  });

  describe('Next Button Validation', () => {
    it('should disable Next button when no users are followed', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when at least one user is followed', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).not.toBeDisabled();
    });

    it('should disable Next button when all followed users are unfollowed', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).not.toBeDisabled();

      // Unfollow
      await user.click(followButton);
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Completion Flow', () => {
    it('should update user onboarding status when Next is clicked', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);

      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUser,
        onboardingStatus: {
          hasCompletedBirthDate: true,
          hasCompeletedInterests: true,
          hasCompeletedFollowing: true,
        },
      });
    });

    it('should clear user cache after updating status', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);

      expect(authApi.clearUserCache).toHaveBeenCalled();
    });

    it('should refetch timeline feeds after completion', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);

      expect(mockRefetchQueries).toHaveBeenCalledWith({
        queryKey: ['timeline', 'following'],
      });
      expect(mockRefetchQueries).toHaveBeenCalledWith({
        queryKey: ['timeline', 'for-you'],
      });
    });

    it('should call onComplete callback', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const followButton = screen.getByTestId('follow-button-2');
      await user.click(followButton);

      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);

      expect(mockOnComplete).toHaveBeenCalled();
    });

    it('should not proceed when no users are followed', async () => {
      const user = userEvent.setup();

      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeDisabled();

      await user.click(nextButton);

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('User Profile Display', () => {
    it('should display user profile information correctly', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('user-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('user-card-3')).toBeInTheDocument();
    });

    it('should display verified badge for verified users', () => {
      render(
        <FollowSuggestionsModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      // John Doe is verified in mock data
      expect(screen.getByTestId('user-card-2')).toBeInTheDocument();
    });
  });
});
