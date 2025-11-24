import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import ActionsPanel from '../ActionsPanel';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the dependencies
vi.mock('../hooks', () => ({
  useProfile: () => ({
    handleSaveProfile: vi.fn(),
    isUpdating: false,
  }),
}));

vi.mock('@/components/generic/EditProfileModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="edit-profile-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  },
}));

vi.mock('@/components/generic/buttons/FollowBtn', () => ({
  default: ({ isFollowed }: { isFollowed: boolean }) => (
    <button data-testid="profile-follow-button">
      {isFollowed ? 'Following' : 'Follow'}
    </button>
  ),
}));

const mockUserData = {
  name: 'John Doe',
  userId: 123,
  bio: 'Software Developer',
  isFollowed: false,
  profileImage: '/profile.jpg',
  bannerImage: '/banner.jpg',
  location: 'New York',
  website: 'https://example.com',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('ActionsPanel', () => {
  describe('Own Profile', () => {
    it('should render actions panel container', () => {
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      const panel = screen.getByTestId('profile-actions-panel');
      expect(panel).toBeInTheDocument();
    });

    it('should render Edit Profile button when viewing own profile', () => {
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      const editButton = screen.getByTestId('profile-edit-button');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent('Edit Profile');
    });

    it('should open modal when Edit Profile button is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      const editButton = screen.getByTestId('profile-edit-button');
      await user.click(editButton);

      await waitFor(() => {
        const modal = screen.getByTestId('edit-profile-modal');
        expect(modal).toBeInTheDocument();
      });
    });

    it('should close modal when close is triggered', async () => {
      const user = userEvent.setup();
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      // Open modal
      const editButton = screen.getByTestId('profile-edit-button');
      await user.click(editButton);

      // Close modal
      const closeButton = screen.getByText('Close Modal');
      await user.click(closeButton);

      await waitFor(() => {
        const modal = screen.queryByTestId('edit-profile-modal');
        expect(modal).not.toBeInTheDocument();
      });
    });

    it('should not render follow, message, or more buttons for own profile', () => {
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      expect(
        screen.queryByTestId('profile-more-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-message-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-follow-button')
      ).not.toBeInTheDocument();
    });
  });

  describe("Other User's Profile", () => {
    it('should render actions panel container', () => {
      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const panel = screen.getByTestId('profile-actions-panel');
      expect(panel).toBeInTheDocument();
    });

    it('should render More, Message, and Follow buttons for other profiles', () => {
      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      expect(screen.getByTestId('profile-more-button')).toBeInTheDocument();
      expect(screen.getByTestId('profile-message-button')).toBeInTheDocument();
      expect(screen.getByTestId('profile-follow-button')).toBeInTheDocument();
    });

    it('should not render Edit Profile button for other profiles', () => {
      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      expect(
        screen.queryByTestId('profile-edit-button')
      ).not.toBeInTheDocument();
    });

    it('should render Follow button with correct follow state', () => {
      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const followButton = screen.getByTestId('profile-follow-button');
      expect(followButton).toHaveTextContent('Follow');
    });

    it('should render Following button when user is followed', () => {
      const followedUser = { ...mockUserData, isFollowed: true };
      render(<ActionsPanel isOwnProfile={false} userData={followedUser} />);

      const followButton = screen.getByTestId('profile-follow-button');
      expect(followButton).toHaveTextContent('Following');
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      render(<ActionsPanel isOwnProfile={true} userData={mockUserData} />);

      const panel = screen.getByTestId('profile-actions-panel');
      expect(panel).toHaveClass(
        'flex',
        'flex-row',
        'justify-end',
        'items-start',
        'p-3',
        'gap-3',
        'w-full'
      );
    });
  });
});
