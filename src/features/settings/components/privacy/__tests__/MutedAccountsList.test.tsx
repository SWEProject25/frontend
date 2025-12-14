import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MutedAccountsList from '../MutedAccountsList';
import { useGetMutedUsers } from '@/hooks/useInteractions';
import { MutedUsersListResponseDto } from '@/types/userInteractions';

// Mock the hooks
vi.mock('@/hooks/useInteractions', () => ({
  useGetMutedUsers: vi.fn(),
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
      <div data-testid={`user-${userId}-muted`}>
        Muted: {props.isMuted ? 'true' : 'false'}
      </div>
      <div data-testid={`user-${userId}-action`}>
        Action: {props.actionType}
      </div>
    </div>
  ),
}));

vi.mock('@/components/generic', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

const mockMutedUser = {
  id: 1,
  username: 'muteduser',
  displayName: 'Muted User',
  profileImageUrl: 'https://example.com/avatar.jpg',
  bio: 'This is a muted user',
  mutedAt: '2024-01-01T00:00:00Z',
};

const mockMutedUsersResponse: MutedUsersListResponseDto = {
  status: 'success',
  message: 'Muted users retrieved successfully',
  data: [mockMutedUser],
  metadata: {
    totalItems: 1,
    page: 1,
    limit: 50,
    totalPages: 1,
  },
};

describe('MutedAccountsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loader when data is loading', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty message when no muted users', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: {
          status: 'success',
          message: 'No muted users',
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

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-empty')).toBeInTheDocument();
      expect(
        screen.getByTestId('muted-accounts-empty-title')
      ).toHaveTextContent("You aren't muting anyone");
      expect(
        screen.getByTestId('muted-accounts-empty-description')
      ).toHaveTextContent("When you mute someone, you'll see them here.");
    });

    it('should display empty message when data is undefined', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-empty')).toBeInTheDocument();
    });
  });

  describe('Success State with Muted Users', () => {
    it('should render list of muted users', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: mockMutedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-list')).toBeInTheDocument();
      expect(
        screen.getByTestId(`muted-account-item-${mockMutedUser.id}`)
      ).toBeInTheDocument();
      expect(screen.getByText(mockMutedUser.displayName)).toBeInTheDocument();
      expect(
        screen.getByText(`@${mockMutedUser.username}`)
      ).toBeInTheDocument();
    });

    it('should render UserCard with correct props for muted users', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: mockMutedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(
        screen.getByTestId(`user-${mockMutedUser.id}-muted`)
      ).toHaveTextContent('Muted: true');
      expect(
        screen.getByTestId(`user-${mockMutedUser.id}-action`)
      ).toHaveTextContent('Action: mute');
    });

    it('should render ListItem with correct href for each muted user', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: mockMutedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      const listItem = screen.getByTestId(
        `muted-account-item-${mockMutedUser.id}`
      );
      expect(listItem).toHaveAttribute(
        'data-href',
        `/${mockMutedUser.username}`
      );
    });

    it('should render multiple muted users', () => {
      const multipleMutedUsers: MutedUsersListResponseDto = {
        status: 'success',
        message: 'Muted users retrieved successfully',
        data: [
          mockMutedUser,
          {
            id: 2,
            username: 'muteduser2',
            displayName: 'Muted User 2',
            profileImageUrl: null,
            bio: null,
            mutedAt: '2024-01-02T00:00:00Z',
          },
          {
            id: 3,
            username: 'muteduser3',
            displayName: 'Muted User 3',
            profileImageUrl: 'https://example.com/avatar3.jpg',
            bio: 'Another muted user',
            mutedAt: '2024-01-03T00:00:00Z',
          },
        ],
        metadata: {
          totalItems: 3,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      };

      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: multipleMutedUsers,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-list')).toBeInTheDocument();
      expect(screen.getByTestId('muted-account-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('muted-account-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('muted-account-item-3')).toBeInTheDocument();
      expect(screen.getByText('Muted User')).toBeInTheDocument();
      expect(screen.getByText('Muted User 2')).toBeInTheDocument();
      expect(screen.getByText('Muted User 3')).toBeInTheDocument();
    });

    it('should handle users with null profileImageUrl', () => {
      const userWithNoAvatar = {
        ...mockMutedUser,
        id: 4,
        profileImageUrl: null,
      };

      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: {
          ...mockMutedUsersResponse,
          data: [userWithNoAvatar],
        },
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-list')).toBeInTheDocument();
      expect(
        screen.getByTestId(`muted-account-item-${userWithNoAvatar.id}`)
      ).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should call useGetMutedUsers with correct params', () => {
      const mockUseGetMutedUsers = vi.mocked(useGetMutedUsers);
      mockUseGetMutedUsers.mockReturnValue({
        data: mockMutedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(mockUseGetMutedUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
      });
    });
  });

  describe('Data Handling', () => {
    it('should handle empty data array gracefully', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: {
          status: 'success',
          message: 'No muted users',
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

      render(<MutedAccountsList />);

      expect(screen.getByTestId('muted-accounts-empty')).toBeInTheDocument();
      expect(
        screen.queryByTestId('muted-accounts-list')
      ).not.toBeInTheDocument();
    });

    it('should not display error state when isError is false', () => {
      vi.mocked(useGetMutedUsers).mockReturnValue({
        data: mockMutedUsersResponse,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(<MutedAccountsList />);

      expect(
        screen.queryByText('Failed to load muted users')
      ).not.toBeInTheDocument();
    });
  });
});
