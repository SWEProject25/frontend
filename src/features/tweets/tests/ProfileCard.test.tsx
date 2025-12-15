import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileCard from '../components/ProfileCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockProfileData = {
  id: 1,
  name: 'Test User',
  bio: 'Test bio',
  avatar: 'https://example.com/avatar.jpg',
  banner: 'https://example.com/banner.jpg',
  verified: true,
  followersCount: 100,
  followingCount: 50,
  isFollowedByMe: false,
  isBlockedByMe: false,
  isMutedByMe: false,
  User: {
    username: 'testuser',
  },
};

const mockUseProfileByUserId = vi.fn(() => ({
  data: { data: mockProfileData },
  isLoading: false,
  error: null,
}));

vi.mock('@/features/profile/store/profileQueries', () => ({
  useProfileByUserId: () => mockUseProfileByUserId(),
}));

vi.mock('@/features/profile/store/profileStore', () => ({
  useProfileStore: () => ({
    setCurrentProfile: vi.fn(),
  }),
}));

vi.mock('@/features/authentication/hooks', () => ({
  useAuth: () => ({
    user: { id: 2 },
  }),
}));

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    muteUser: vi.fn(),
    unmuteUser: vi.fn(),
    isBlockLoading: false,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ProfileCard Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    mockUseProfileByUserId.mockReturnValue({
      data: { data: mockProfileData },
      isLoading: false,
      error: null,
    });
  });

  it('should render profile card with user data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileCard userId={1} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });

  it('should display follower and following counts', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileCard userId={1} />
      </QueryClientProvider>
    );

    expect(screen.getByText(/100/)).toBeInTheDocument(); // followers
    expect(screen.getByText(/50/)).toBeInTheDocument(); // following
  });

  it('should show verified badge for verified users', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileCard userId={1} />
      </QueryClientProvider>
    );

    // Check for verified badge SVG or icon
    const verifiedIcon = document.querySelector('svg[viewBox="0 0 24 24"]');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('should render follow button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileCard userId={1} />
      </QueryClientProvider>
    );

    const followButton = screen.getByRole('button', { name: /follow/i });
    expect(followButton).toBeInTheDocument();
  });

  // it('should show loading state', () => {
  //   mockUseProfileByUserId.mockReturnValue({
  //     data: { data: null },
  //     isLoading: true,
  //     error: null,
  //   });

  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <ProfileCard userId={1} />
  //     </QueryClientProvider>
  //   );

  //   // Check for loading spinner
  //   const spinner = document.querySelector('.animate-spin');
  //   expect(spinner).toBeInTheDocument();
  // });
});
