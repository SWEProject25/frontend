import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import FollowStats from '../FollowStats';

describe('FollowStats', () => {
  const defaultProps = {
    followingCount: 100,
    followersCount: 250,
    username: 'ahmedFathy',
    userId: 5,
    isMine: false,
  };

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
});
