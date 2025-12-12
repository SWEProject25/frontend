import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import ActionsPanel from '../ActionsPanel';

// Hoisted mocks - must be declared with vi.hoisted
const {
  mockPush,
  mockFetchConversations,
  mockCreateConversation,
  mockMuteUser,
  mockUnmuteUser,
  mockBlockUser,
  mockUnblockUser,
} = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockFetchConversations: vi.fn(),
  mockCreateConversation: vi.fn(),
  mockMuteUser: vi.fn(),
  mockUnmuteUser: vi.fn(),
  mockBlockUser: vi.fn(),
  mockUnblockUser: vi.fn(),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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

// Mock messages API
vi.mock('@/features/messages/api/messages', () => ({
  fetchConversations: mockFetchConversations,
  createConversation: mockCreateConversation,
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

vi.mock('@/components/generic/buttons/BlockBtn', () => ({
  default: ({ isBlocked }: { isBlocked: boolean }) => (
    <button data-testid="profile-block-button">
      {isBlocked ? 'Blocked' : 'Block'}
    </button>
  ),
}));

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    muteUser: mockMuteUser,
    unmuteUser: mockUnmuteUser,
    blockUser: mockBlockUser,
    unblockUser: mockUnblockUser,
  }),
}));

const mockUserData = {
  name: 'John Doe',
  username: 'johndoe',
  userId: 123,
  bio: 'Software Developer',
  isFollowed: false,
  isFollowingMe: false,
  isMuted: false,
  isBlocked: false,
  isBeenBlocked: false,
  profileImage: '/profile.jpg',
  bannerImage: '/banner.jpg',
  location: 'New York',
  website: 'https://example.com',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('ActionsPanel', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockFetchConversations.mockClear();
    mockCreateConversation.mockClear();
    mockMuteUser.mockClear();
    mockUnmuteUser.mockClear();
    mockBlockUser.mockClear();
    mockUnblockUser.mockClear();
    // Set default implementations
    mockFetchConversations.mockResolvedValue([]);
    mockCreateConversation.mockResolvedValue({ data: { id: 'default-id' } });
  });

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

  describe('Message Button Functionality', () => {
    it('should navigate to existing conversation when found by user.id', async () => {
      const user = userEvent.setup();
      const existingConversation = {
        id: 'conv-123',
        user: { id: 123 },
      };
      mockFetchConversations.mockResolvedValue([existingConversation]);

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(mockFetchConversations).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/messages/conv-123');
      });
    });

    it('should navigate to existing conversation when found by user1Id', async () => {
      const user = userEvent.setup();
      const existingConversation = {
        conversationId: 'conv-456',
        user1Id: 123,
      };
      mockFetchConversations.mockResolvedValue([existingConversation]);

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(mockFetchConversations).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/messages/conv-456');
      });
    });

    it('should navigate to existing conversation when found by user2Id', async () => {
      const user = userEvent.setup();
      const existingConversation = {
        id: 'conv-789',
        user2Id: 123,
      };
      mockFetchConversations.mockResolvedValue([existingConversation]);

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(mockFetchConversations).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/messages/conv-789');
      });
    });

    it('should create new conversation when no existing conversation found', async () => {
      const user = userEvent.setup();
      mockFetchConversations.mockResolvedValue([]);
      mockCreateConversation.mockResolvedValue({
        data: { id: 'new-conv-123' },
      });

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(mockFetchConversations).toHaveBeenCalled();
        expect(mockCreateConversation).toHaveBeenCalledWith(123);
        expect(mockPush).toHaveBeenCalledWith('/messages/new-conv-123');
      });
    });

    it('should handle conversationId in different response structures', async () => {
      const user = userEvent.setup();
      mockFetchConversations.mockResolvedValue([]);
      mockCreateConversation.mockResolvedValue({
        data: { conversationId: 'conv-xyz' },
      });

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/messages/conv-xyz');
      });
    });

    it('should navigate to /messages on error', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockFetchConversations.mockRejectedValue(new Error('Network error'));

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');
      await user.click(messageButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error handling conversation:',
          expect.any(Error)
        );
        expect(mockPush).toHaveBeenCalledWith('/messages');
      });

      consoleErrorSpy.mockRestore();
    });

    it('should not do anything if already creating conversation', async () => {
      const user = userEvent.setup();
      mockFetchConversations.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve([]), 100);
          })
      );

      render(<ActionsPanel isOwnProfile={false} userData={mockUserData} />);

      const messageButton = screen.getByTestId('profile-message-button');

      // Click twice rapidly
      await user.click(messageButton);
      await user.click(messageButton);

      // Should only call fetchConversations once
      await waitFor(() => {
        expect(mockFetchConversations).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Dropdown Actions - Mute/Unmute', () => {
    it('should call muteUser when mute is clicked on unmuted user', async () => {
      const user = userEvent.setup();
      const unmutedUser = { ...mockUserData, isMuted: false };
      render(<ActionsPanel isOwnProfile={false} userData={unmutedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      // Find and click the mute option
      const muteOption = screen.getByText(/Mute/i);
      await user.click(muteOption);

      await waitFor(() => {
        expect(mockMuteUser).toHaveBeenCalledWith(123);
      });
    });

    it('should call unmuteUser when mute is clicked on muted user', async () => {
      const user = userEvent.setup();
      const mutedUser = { ...mockUserData, isMuted: true };
      render(<ActionsPanel isOwnProfile={false} userData={mutedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      // Find and click the unmute option
      const unmuteOption = screen.getByText(/Unmute/i);
      await user.click(unmuteOption);

      await waitFor(() => {
        expect(mockUnmuteUser).toHaveBeenCalledWith(123);
      });
    });
  });

  describe('Dropdown Actions - Block/Unblock Confirmation', () => {
    it('should show block confirmation modal when block is clicked', async () => {
      const user = userEvent.setup();
      const unblockedUser = { ...mockUserData, isBlocked: false };
      render(<ActionsPanel isOwnProfile={false} userData={unblockedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      // Find and click the block option
      const blockOption = screen.getByText(/Block/i);
      await user.click(blockOption);

      await waitFor(() => {
        expect(screen.getByText('Block user?')).toBeInTheDocument();
      });
    });

    it('should show unblock confirmation modal when unblock is clicked', async () => {
      const user = userEvent.setup();
      const blockedUser = { ...mockUserData, isBlocked: true };
      render(<ActionsPanel isOwnProfile={false} userData={blockedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      // Find and click the unblock option
      const unblockOption = screen.getByText(/Unblock/i);
      await user.click(unblockOption);

      await waitFor(() => {
        expect(screen.getByText('Unblock user?')).toBeInTheDocument();
      });
    });

    it('should call blockUser when block is confirmed', async () => {
      const user = userEvent.setup();
      const unblockedUser = { ...mockUserData, isBlocked: false };
      render(<ActionsPanel isOwnProfile={false} userData={unblockedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      const blockOption = screen.getByText(/Block/i);
      await user.click(blockOption);

      // Confirm the block
      const confirmButton = screen.getByText('Block');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockBlockUser).toHaveBeenCalledWith(123);
      });
    });

    it('should call unblockUser when unblock is confirmed', async () => {
      const user = userEvent.setup();
      const blockedUser = { ...mockUserData, isBlocked: true };
      render(<ActionsPanel isOwnProfile={false} userData={blockedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      const unblockOption = screen.getByText(/Unblock/i);
      await user.click(unblockOption);

      // Confirm the unblock
      const confirmButton = screen.getByText('Unblock');
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockUnblockUser).toHaveBeenCalledWith(123);
      });
    });

    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      const unblockedUser = { ...mockUserData, isBlocked: false };
      render(<ActionsPanel isOwnProfile={false} userData={unblockedUser} />);

      const moreButton = screen.getByTestId('profile-more-button');
      await user.click(moreButton);

      const blockOption = screen.getByText(/Block/i);
      await user.click(blockOption);

      // Cancel the block
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Block user?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Blocking and Being Blocked Scenarios', () => {
    it('should hide message and follow buttons when user is blocked (isBlocked=true)', () => {
      const blockedUserData = { ...mockUserData, isBlocked: true };
      render(<ActionsPanel isOwnProfile={false} userData={blockedUserData} />);

      // Should show more button
      expect(screen.getByTestId('profile-more-button')).toBeInTheDocument();

      // Should show block button
      expect(screen.getByTestId('profile-block-button')).toBeInTheDocument();

      // Should NOT show message button
      expect(
        screen.queryByTestId('profile-message-button')
      ).not.toBeInTheDocument();

      // Should NOT show follow button
      expect(
        screen.queryByTestId('profile-follow-button')
      ).not.toBeInTheDocument();
    });

    it('should hide message and follow buttons when user has blocked you (isBeenBlocked=true)', () => {
      const beenBlockedUserData = { ...mockUserData, isBeenBlocked: true };
      render(
        <ActionsPanel isOwnProfile={false} userData={beenBlockedUserData} />
      );

      // Should show more button
      expect(screen.getByTestId('profile-more-button')).toBeInTheDocument();

      // Should NOT show block button (since isBlocked is false)
      expect(
        screen.queryByTestId('profile-block-button')
      ).not.toBeInTheDocument();

      // Should NOT show message button
      expect(
        screen.queryByTestId('profile-message-button')
      ).not.toBeInTheDocument();

      // Should NOT show follow button
      expect(
        screen.queryByTestId('profile-follow-button')
      ).not.toBeInTheDocument();
    });

    it('should show only more dropdown when both isBlocked=false and isBeenBlocked=true', () => {
      const beenBlockedUserData = {
        ...mockUserData,
        isBlocked: false,
        isBeenBlocked: true,
      };
      render(
        <ActionsPanel isOwnProfile={false} userData={beenBlockedUserData} />
      );

      // Should show more button
      expect(screen.getByTestId('profile-more-button')).toBeInTheDocument();

      // Should NOT show any action buttons
      expect(
        screen.queryByTestId('profile-block-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-message-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('profile-follow-button')
      ).not.toBeInTheDocument();
    });

    it('should show all action buttons when neither blocked nor been blocked', () => {
      const normalUserData = {
        ...mockUserData,
        isBlocked: false,
        isBeenBlocked: false,
      };
      render(<ActionsPanel isOwnProfile={false} userData={normalUserData} />);

      // Should show more button
      expect(screen.getByTestId('profile-more-button')).toBeInTheDocument();

      // Should show message button
      expect(screen.getByTestId('profile-message-button')).toBeInTheDocument();

      // Should show follow button
      expect(screen.getByTestId('profile-follow-button')).toBeInTheDocument();

      // Should NOT show block button
      expect(
        screen.queryByTestId('profile-block-button')
      ).not.toBeInTheDocument();
    });

    it('should render block button with correct blocked state', () => {
      const blockedUserData = { ...mockUserData, isBlocked: true };
      render(<ActionsPanel isOwnProfile={false} userData={blockedUserData} />);

      const blockButton = screen.getByTestId('profile-block-button');
      expect(blockButton).toHaveTextContent('Blocked');
    });

    it('should show message and follow when both isBlocked and isBeenBlocked are undefined', () => {
      const undefinedBlockUserData = {
        ...mockUserData,
        isBlocked: undefined,
        isBeenBlocked: undefined,
      };
      render(
        <ActionsPanel isOwnProfile={false} userData={undefinedBlockUserData} />
      );

      // Should show message button (undefined is falsy)
      expect(screen.getByTestId('profile-message-button')).toBeInTheDocument();

      // Should show follow button (undefined is falsy)
      expect(screen.getByTestId('profile-follow-button')).toBeInTheDocument();

      // Should NOT show block button
      expect(
        screen.queryByTestId('profile-block-button')
      ).not.toBeInTheDocument();
    });
  });
});
