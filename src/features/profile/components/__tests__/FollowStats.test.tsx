import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import FollowStats from '../FollowStats';
import { useFollowersYouKnow } from '@/hooks/interactions';

// Mock the hook
vi.mock('@/hooks/interactions', () => ({
  useFollowersYouKnow: vi.fn(),
}));

const mockUseFollowersYouKnow = useFollowersYouKnow as ReturnType<typeof vi.fn>;

describe('FollowStats', () => {
  const defaultProps = {
    followingCount: 100,
    followersCount: 250,
    username: 'ahmedFathy',
    userId: 5,
    isMine: false,
  };

  beforeEach(() => {
    mockUseFollowersYouKnow.mockReturnValue({
      data: undefined,
    });
  });

  it('should render follow stats container', () => {
    render(<FollowStats {...defaultProps} />);

    const container = screen.getByTestId('profile-follow-stats');
    expect(container).toBeInTheDocument();
  });

  describe('Following Stats', () => {
    it('should render following count', () => {
      render(<FollowStats {...defaultProps} />);

      const followingCount = screen.getByTestId('profile-following-count');
      expect(followingCount).toBeInTheDocument();
      expect(followingCount).toHaveTextContent('100');
    });

    it('should render following label', () => {
      render(<FollowStats {...defaultProps} />);

      const followingStat = screen.getByTestId('profile-following-stat');
      expect(followingStat).toBeInTheDocument();
      expect(followingStat).toHaveTextContent('Following');
    });

    it('should have correct styling for following count', () => {
      render(<FollowStats {...defaultProps} />);

      const followingCount = screen.getByTestId('profile-following-count');
      expect(followingCount).toHaveClass(
        'font-inter',
        'font-bold',
        'text-sm',
        'sm:text-base',
        'text-text-active'
      );
    });
  });

  describe('Followers Stats', () => {
    it('should render followers count', () => {
      render(<FollowStats {...defaultProps} />);

      const followersCount = screen.getByTestId('profile-followers-count');
      expect(followersCount).toBeInTheDocument();
      expect(followersCount).toHaveTextContent('250');
    });

    it('should render followers label', () => {
      render(<FollowStats {...defaultProps} />);

      const followersStat = screen.getByTestId('profile-followers-stat');
      expect(followersStat).toBeInTheDocument();
      expect(followersStat).toHaveTextContent('Followers');
    });

    it('should have correct styling for followers count', () => {
      render(<FollowStats {...defaultProps} />);

      const followersCount = screen.getByTestId('profile-followers-count');
      expect(followersCount).toHaveClass(
        'font-inter',
        'font-bold',
        'text-sm',
        'sm:text-base',
        'text-text-active'
      );
    });
  });

  describe('Various Count Values', () => {
    it('should display zero counts', () => {
      render(
        <FollowStats {...defaultProps} followingCount={0} followersCount={0} />
      );

      expect(screen.getByTestId('profile-following-count')).toHaveTextContent(
        '0'
      );
      expect(screen.getByTestId('profile-followers-count')).toHaveTextContent(
        '0'
      );
    });

    it('should display large counts', () => {
      render(
        <FollowStats
          {...defaultProps}
          followingCount={10000}
          followersCount={50000}
        />
      );

      expect(screen.getByTestId('profile-following-count')).toHaveTextContent(
        '10000'
      );
      expect(screen.getByTestId('profile-followers-count')).toHaveTextContent(
        '50000'
      );
    });

    it('should update counts when props change', () => {
      const { rerender } = render(
        <FollowStats
          {...defaultProps}
          followingCount={100}
          followersCount={200}
        />
      );

      expect(screen.getByTestId('profile-following-count')).toHaveTextContent(
        '100'
      );
      expect(screen.getByTestId('profile-followers-count')).toHaveTextContent(
        '200'
      );

      rerender(
        <FollowStats
          {...defaultProps}
          followingCount={150}
          followersCount={300}
        />
      );

      expect(screen.getByTestId('profile-following-count')).toHaveTextContent(
        '150'
      );
      expect(screen.getByTestId('profile-followers-count')).toHaveTextContent(
        '300'
      );
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct container classes', () => {
      render(<FollowStats {...defaultProps} />);

      const container = screen.getByTestId('profile-follow-stats');
      expect(container).toHaveClass('flex', 'flex-col', 'gap-3', 'w-full');
    });

    it('should have correct stat item classes', () => {
      render(<FollowStats {...defaultProps} />);

      const followingStat = screen.getByTestId('profile-following-stat');
      const followersStat = screen.getByTestId('profile-followers-stat');

      expect(followingStat).toHaveClass(
        'flex',
        'flex-row',
        'items-baseline',
        'gap-1'
      );
      expect(followersStat).toHaveClass(
        'flex',
        'flex-row',
        'items-baseline',
        'gap-1'
      );
    });
  });

  describe('Followers You Know', () => {
    it('should not show followers you know when viewing own profile', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
          ],
          metadata: { totalItems: 1 },
        },
      });

      render(<FollowStats {...defaultProps} isMine={true} />);

      const followersYouKnow = screen.queryByTestId(
        'profile-followers-you-know'
      );
      expect(followersYouKnow).not.toBeInTheDocument();
    });

    it('should not show followers you know when none exist', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [],
          metadata: { totalItems: 0 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnow = screen.queryByTestId(
        'profile-followers-you-know'
      );
      expect(followersYouKnow).not.toBeInTheDocument();
    });

    it('should show one follower you know', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
          ],
          metadata: { totalItems: 1 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnow = screen.getByTestId('profile-followers-you-know');
      expect(followersYouKnow).toBeInTheDocument();
      expect(followersYouKnow).toHaveTextContent('Followed by John Doe');
    });

    it('should handle edge case with followers but totalItems is 0 or negative', () => {
      // This tests the fallback return '' on line 47
      // When there's data but totalItems doesn't match expected values (not 1, not 2, and remaining <= 0)
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
            {
              id: 2,
              displayName: 'Jane Smith',
              profileImageUrl: 'https://example.com/jane.jpg',
            },
          ],
          metadata: { totalItems: -1 }, // Edge case: negative totalItems
        },
      });

      render(<FollowStats {...defaultProps} />);

      // Should not show followers you know section when totalItems is <= 0
      const followersYouKnow = screen.queryByTestId(
        'profile-followers-you-know'
      );
      expect(followersYouKnow).not.toBeInTheDocument();
    });

    it('should show two followers you know', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
            {
              id: 2,
              displayName: 'Jane Smith',
              profileImageUrl: 'https://example.com/jane.jpg',
            },
          ],
          metadata: { totalItems: 2 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnow = screen.getByTestId('profile-followers-you-know');
      expect(followersYouKnow).toHaveTextContent(
        'Followed by John Doe and Jane Smith'
      );
    });

    it('should show two followers plus one other', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
            {
              id: 2,
              displayName: 'Jane Smith',
              profileImageUrl: 'https://example.com/jane.jpg',
            },
            {
              id: 3,
              displayName: 'Bob Johnson',
              profileImageUrl: 'https://example.com/bob.jpg',
            },
          ],
          metadata: { totalItems: 3 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnow = screen.getByTestId('profile-followers-you-know');
      expect(followersYouKnow).toHaveTextContent(
        'Followed by John Doe, Jane Smith and 1 other you follow'
      );
    });

    it('should show two followers plus multiple others', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
            {
              id: 2,
              displayName: 'Jane Smith',
              profileImageUrl: 'https://example.com/jane.jpg',
            },
            {
              id: 3,
              displayName: 'Bob Johnson',
              profileImageUrl: 'https://example.com/bob.jpg',
            },
          ],
          metadata: { totalItems: 5 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnow = screen.getByTestId('profile-followers-you-know');
      expect(followersYouKnow).toHaveTextContent(
        'Followed by John Doe, Jane Smith and 3 others you follow'
      );
    });

    it('should render avatar stack for followers you know', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
            {
              id: 2,
              displayName: 'Jane Smith',
              profileImageUrl: null,
            },
            {
              id: 3,
              displayName: 'Bob Johnson',
              profileImageUrl: 'https://example.com/bob.jpg',
            },
          ],
          metadata: { totalItems: 3 },
        },
      });

      const { container } = render(<FollowStats {...defaultProps} />);

      // Check avatar stack exists
      const avatarStack = container.querySelector('.-space-x-2');
      expect(avatarStack).toBeInTheDocument();

      // Should show 3 avatars
      const avatars = container.querySelectorAll('.-space-x-2 > div');
      expect(avatars).toHaveLength(3);
    });

    it('should have correct link to followers-you-know page', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
          ],
          metadata: { totalItems: 1 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnowLink = screen.getByTestId(
        'profile-followers-you-know'
      );
      expect(followersYouKnowLink).toHaveAttribute(
        'href',
        '/ahmedFathy/followers-you-know'
      );
    });

    it('should have hover effects on followers you know', () => {
      mockUseFollowersYouKnow.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              displayName: 'John Doe',
              profileImageUrl: 'https://example.com/john.jpg',
            },
          ],
          metadata: { totalItems: 1 },
        },
      });

      render(<FollowStats {...defaultProps} />);

      const followersYouKnowLink = screen.getByTestId(
        'profile-followers-you-know'
      );
      expect(followersYouKnowLink).toHaveClass(
        'hover:underline',
        'cursor-pointer',
        'group'
      );
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for following link', () => {
      render(<FollowStats {...defaultProps} />);

      const followingLink = screen.getByTestId('profile-following-stat');
      expect(followingLink).toHaveAttribute('href', '/ahmedFathy/following');
    });

    it('should have correct href for followers link', () => {
      render(<FollowStats {...defaultProps} />);

      const followersLink = screen.getByTestId('profile-followers-stat');
      expect(followersLink).toHaveAttribute('href', '/ahmedFathy/followers');
    });

    it('should update links when username changes', () => {
      const { rerender } = render(<FollowStats {...defaultProps} />);

      expect(screen.getByTestId('profile-following-stat')).toHaveAttribute(
        'href',
        '/ahmedFathy/following'
      );

      rerender(<FollowStats {...defaultProps} username="newUsername" />);

      expect(screen.getByTestId('profile-following-stat')).toHaveAttribute(
        'href',
        '/newUsername/following'
      );
      expect(screen.getByTestId('profile-followers-stat')).toHaveAttribute(
        'href',
        '/newUsername/followers'
      );
    });
  });
});
