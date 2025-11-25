import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProfileContainer from '../ProfileContainer';

// Mock child components
vi.mock('../UserInfo', () => ({
  default: () => <div data-testid="user-info">User Info</div>,
}));

vi.mock('../Description', () => ({
  default: () => <div data-testid="description">Description</div>,
}));

vi.mock('../UserDetails', () => ({
  default: () => <div data-testid="user-details">User Details</div>,
}));

vi.mock('../FollowStats', () => ({
  default: () => <div data-testid="follow-stats">Follow Stats</div>,
}));

vi.mock('../ActionsPanel', () => ({
  default: () => <div data-testid="actions-panel">Actions Panel</div>,
}));

vi.mock('@/components/generic/Cover', () => ({
  default: () => <div data-testid="cover">Cover</div>,
}));

vi.mock('@/components/generic/Avatar', () => ({
  default: () => <div data-testid="avatar">Avatar</div>,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ProfileContainer', () => {
  const defaultProps = {
    profileData: {
      id: 1,
      user_id: 1,
      is_deactivated: false,
      updated_at: '2022-01-01',
      followers_count: 200,
      name: 'Test User',
      bio: 'Test bio',
      location: 'Test Location',
      website: 'https://test.com',
      profile_image_url: 'https://example.com/avatar.jpg',
      banner_image_url: 'https://example.com/banner.jpg',
      birth_date: '1990-01-01',
      created_at: '2020-01-01',
      verified: false,
      following_count: 100,
      follower_count: 200,
      is_followed_by_me: false,
      User: {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        role: 'user',
        created_at: '2020-01-01',
      },
    },
    isMine: false,
  };

  it('should render profile container', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
  });

  it('should render cover image', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('cover')).toBeInTheDocument();
  });

  it('should render avatar', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('should render user info', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('description')).toBeInTheDocument();
  });

  it('should render user details', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('user-details')).toBeInTheDocument();
  });

  it('should render follow stats', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('follow-stats')).toBeInTheDocument();
  });

  it('should render actions panel', () => {
    render(<ProfileContainer {...defaultProps} />, { wrapper });
    expect(screen.getByTestId('actions-panel')).toBeInTheDocument();
  });

  it('should render for own profile', () => {
    const ownProfileProps = { ...defaultProps, isMine: true };
    render(<ProfileContainer {...ownProfileProps} />, { wrapper });
    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
  });
});
