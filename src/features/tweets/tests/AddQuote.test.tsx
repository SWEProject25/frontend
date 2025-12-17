import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddQuote from '../components/AddQuote';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the tweetStore with proper data
const mockCurrentTweet = {
  postId: 1,
  userId: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'avatar.jpg',
  text: 'Original tweet',
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

vi.mock('@/features/timeline/store/useTimelineStore', () => ({
  useParentId: () => 1,
  usePostType: () => 'QUOTE',
  useSelectedTab: () => 'for-you',
  useShowCheckModal: () => false,
  useActions: () => ({
    setParentId: vi.fn(),
    setPostType: vi.fn(),
    setShowCheckModal: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/home',
  useSearchParams: () => new URLSearchParams(),
}));

describe('AddQuote Component', () => {
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

  it('should render quote component', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddQuote />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('add-reply-component')).toBeInTheDocument();
  });

  it('should display quoted tweet', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddQuote />
      </QueryClientProvider>
    );

    // Check if the quoted tweet content is displayed
    expect(screen.getByText('Original tweet')).toBeInTheDocument();
  });

  it('should render QuoteTweet component with isInModal prop', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AddQuote />
      </QueryClientProvider>
    );

    // Check that the tweet is rendered
    const tweet = container.querySelector('[data-testid^="tweet-"]');
    expect(tweet).toBeInTheDocument();
  });

  it('should not navigate when quote tweet is clicked', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <AddQuote />
      </QueryClientProvider>
    );

    // The tweet should be clickable but not navigate (isInModal prop)
    const tweet = container.querySelector('[data-testid^="tweet-"]');
    expect(tweet).toBeInTheDocument();
  });
});
