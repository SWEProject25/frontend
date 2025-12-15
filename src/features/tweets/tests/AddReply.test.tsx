import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddReply from '../components/AddReply';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  usePathname: () => '/home',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the tweetStore with proper data
const mockCurrentTweet = {
  postId: 1,
  userId: 2,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'avatar.jpg',
  text: 'Original tweet text',
  media: [],
  mentions: [],
  date: '2024-01-01',
  likesCount: 10,
  retweetsCount: 5,
  commentsCount: 3,
  isLikedByMe: false,
  isRepostedByMe: false,
  isFollowedByMe: false,
  isMutedByMe: false,
  isBlockedByMe: false,
  isRepost: false,
  isQuote: false,
  type: 'POST',
};

vi.mock('../store/tweetStore', () => ({
  useTweetStore: (selector: any) =>
    selector({
      currentTweet: mockCurrentTweet,
      setCurrentTweet: vi.fn(),
    }),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: (selector: any) =>
    selector({
      user: { id: 1, username: 'currentuser' },
    }),
}));

vi.mock('@/features/timeline/store/useTimelineStore', () => ({
  useParentId: () => 1,
  usePostType: () => 'REPLY',
  useSelectedTab: () => 'for-you',
  useShowCheckModal: () => false,
  useActions: () => ({
    setParentId: vi.fn(),
    setPostType: vi.fn(),
    setShowCheckModal: vi.fn(),
  }),
}));

describe('AddReply Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should render reply component', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddReply />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('add-reply-component')).toBeInTheDocument();
  });

  it('should display parent tweet being replied to', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddReply />
      </QueryClientProvider>
    );

    // Check if the original tweet content is displayed
    expect(screen.getByText('Original tweet text')).toBeInTheDocument();
  });

  it('should show "Replying to @username" text', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddReply />
      </QueryClientProvider>
    );

    // Check for replying text
    expect(screen.getByText(/Replying to/i)).toBeInTheDocument();
    // Use getAllByText since @testuser appears multiple times (in header and "Replying to" section)
    const usernameElements = screen.getAllByText(/@testuser/i);
    expect(usernameElements.length).toBeGreaterThan(0);
  });

  it('should render SubTweet component', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AddReply />
      </QueryClientProvider>
    );

    // Check if SubTweet is rendered by looking for the tweet container
    const tweet = container.querySelector('[data-testid^="tweet-"]');
    expect(tweet).toBeInTheDocument();
  });

  it('should render AddTweet component for reply input', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddReply />
      </QueryClientProvider>
    );

    // Check if AddTweet container is present
    expect(screen.getByTestId('add-tweet-container')).toBeInTheDocument();
  });
});
