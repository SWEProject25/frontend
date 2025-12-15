import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlockedAccountsList from '../BlockedAccountsList';
import { useGetBlockedUsers } from '@/hooks/useInteractions';
import { BlockedUsersListResponseDto } from '@/types/userInteractions';

// Mock the hooks
vi.mock('@/hooks/useInteractions', () => ({
  useGetBlockedUsers: vi.fn(),
}));

// Mock the components
vi.mock('@/components/ui/ListItem', () => ({
  default: ({ children, href, ...props }: any) => (
    <div data-href={href} {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/UserCard', () => ({
  default: ({ name, handle, userId, ...props }: any) => (
    <div data-testid={props['data-testid']}>
      <div>{name}</div>
      <div>{handle}</div>
      <div data-testid={`user-${userId}-blocked`}>
        Blocked: {props.isBlocked ? 'true' : 'false'}
      </div>
      <div data-testid={`user-${userId}-action`}>
        Action: {props.actionType}
      </div>
    </div>
  ),
}));

vi.mock('@/components/generic/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

const mockBlockedUser = {
  id: 1,
  username: 'blockeduser',
  displayName: 'Blocked User',
  profileImageUrl: 'https://example.com/avatar.jpg',
  bio: 'This is a blocked user',
  blockedAt: '2024-01-01T00:00:00Z',
};

const mockBlockedUsersResponse: BlockedUsersListResponseDto = {
  status: 'success',
  message: 'Blocked users retrieved successfully',
  data: [mockBlockedUser],
  metadata: {
    totalItems: 1,
    page: 1,
    limit: 50,
    totalPages: 1,
  },
};

describe('BlockedAccountsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loader when data is loading', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when query fails', () => {
      const errorMessage = 'Network error';
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(errorMessage),
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-error')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load blocked users')
      ).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display default error message when error has no message', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-error')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no blocked users', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: {
          status: 'success',
          message: 'No blocked users',
          data: [],
          metadata: {
            totalItems: 0,
            page: 1,
            limit: 50,
            totalPages: 0,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-empty')).toBeInTheDocument();
      expect(
        screen.getByTestId('blocked-accounts-empty-title')
      ).toHaveTextContent("You aren't blocking anyone");
      expect(
        screen.getByTestId('blocked-accounts-empty-description')
      ).toHaveTextContent("When you block someone, you'll see them here.");
    });

    it('should display empty message when data is undefined', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-empty')).toBeInTheDocument();
    });
  });

  describe('Success State with Blocked Users', () => {
    it('should render list of blocked users', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: mockBlockedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-list')).toBeInTheDocument();
      expect(
        screen.getByTestId(`blocked-account-item-${mockBlockedUser.id}`)
      ).toBeInTheDocument();
      expect(screen.getByText(mockBlockedUser.displayName)).toBeInTheDocument();
      expect(
        screen.getByText(`@${mockBlockedUser.username}`)
      ).toBeInTheDocument();
    });

    it('should render UserCard with correct props for blocked users', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: mockBlockedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(
        screen.getByTestId(`user-${mockBlockedUser.id}-blocked`)
      ).toHaveTextContent('Blocked: true');
      expect(
        screen.getByTestId(`user-${mockBlockedUser.id}-action`)
      ).toHaveTextContent('Action: block');
    });

    it('should render ListItem with correct href for each blocked user', () => {
      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: mockBlockedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      const listItem = screen.getByTestId(
        `blocked-account-item-${mockBlockedUser.id}`
      );
      expect(listItem).toHaveAttribute(
        'data-href',
        `/${mockBlockedUser.username}`
      );
    });

    it('should render multiple blocked users', () => {
      const multipleBlockedUsers: BlockedUsersListResponseDto = {
        status: 'success',
        message: 'Blocked users retrieved successfully',
        data: [
          mockBlockedUser,
          {
            id: 2,
            username: 'blockeduser2',
            displayName: 'Blocked User 2',
            profileImageUrl: null,
            bio: null,
            blockedAt: '2024-01-02T00:00:00Z',
          },
          {
            id: 3,
            username: 'blockeduser3',
            displayName: 'Blocked User 3',
            profileImageUrl: 'https://example.com/avatar3.jpg',
            bio: 'Another blocked user',
            blockedAt: '2024-01-03T00:00:00Z',
          },
        ],
        metadata: {
          totalItems: 3,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      };

      vi.mocked(useGetBlockedUsers).mockReturnValue({
        data: multipleBlockedUsers,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(screen.getByTestId('blocked-accounts-list')).toBeInTheDocument();
      expect(screen.getByTestId('blocked-account-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('blocked-account-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('blocked-account-item-3')).toBeInTheDocument();
      expect(screen.getByText('Blocked User')).toBeInTheDocument();
      expect(screen.getByText('Blocked User 2')).toBeInTheDocument();
      expect(screen.getByText('Blocked User 3')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useGetBlockedUsers with correct params', () => {
      const mockUseGetBlockedUsers = vi.mocked(useGetBlockedUsers);
      mockUseGetBlockedUsers.mockReturnValue({
        data: mockBlockedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<BlockedAccountsList />);

      expect(mockUseGetBlockedUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
      });
    });
  });
});
