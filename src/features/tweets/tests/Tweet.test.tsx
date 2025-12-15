import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tweet from '../components/Tweet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/home',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/features/authentication/hooks', () => ({
  useAuth: () => ({
    user: { id: 1 },
  }),
}));

vi.mock('@/hooks/useInteractions', () => ({
  useInteractions: () => ({
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    muteUser: vi.fn(),
    unmuteUser: vi.fn(),
    blockUser: vi.fn(),
    unblockUser: vi.fn(),
    isBlockLoading: false,
  }),
}));

vi.mock('../hooks/tweetQueries', () => ({
  useDeleteTweet: () => ({
    mutateAsync: vi.fn(),
  }),
  useGetTweetSummary: () => ({
    data: null,
    refetch: vi.fn(),
  }),
  useToggleLikeTweet: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useToggleRepostTweet: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('../store/tweetStore', () => ({
  useTweetStore: (selector: any) =>
    selector({
      setCurrentTweet: vi.fn(),
      setTweetSummary: vi.fn(),
      setSummaryOpened: vi.fn(),
      setSummaryTweet: vi.fn(),
    }),
}));

vi.mock('@/features/timeline/store/useTimelineStore', () => ({
  useParentId: () => 1,
  usePostType: () => 'POST',
  useSelectedTab: () => 'for-you',
  useShowCheckModal: () => false,
  useActions: () => ({
    setParentId: vi.fn(),
    setPostType: vi.fn(),
  }),
}));

const mockTweetData = {
  postId: 1,
  userId: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'avatar.jpg',
  text: 'Test tweet text',
  media: [],
  mentions: [],
  date: '2024-01-01',
  likesCount: 5,
  retweetsCount: 2,
  commentsCount: 1,
  isLikedByMe: false,
  isRepostedByMe: false,
  isFollowedByMe: false,
  isMutedByMe: false,
  isBlockedByMe: false,
  isRepost: false,
  isQuote: false,
  type: 'POST',
};

describe('Tweet Component', () => {
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

  it('should render tweet with user info and content', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={mockTweetData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getAllByText('testuser')[0]).toBeInTheDocument();
    expect(screen.getByText('Test tweet text')).toBeInTheDocument();
  });

  it('should display repost header when tweet is reposted', () => {
    const repostData = { ...mockTweetData, isRepost: true };
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={repostData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test tweet text')).toBeInTheDocument();
  });

  it('should navigate to tweet detail on click', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={mockTweetData} />
      </QueryClientProvider>
    );

    const tweet = screen.getByTestId(`tweet-${mockTweetData.postId}`);
    expect(tweet).toBeInTheDocument();
  });

  it('should show hover background on mouse enter', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={mockTweetData} />
      </QueryClientProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render actions with correct counts', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={mockTweetData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('1')).toBeInTheDocument(); // comments
    expect(screen.getByText('2')).toBeInTheDocument(); // retweets
    expect(screen.getByText('5')).toBeInTheDocument(); // likes
  });

  it('should open delete modal for own tweets', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={mockTweetData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test tweet text')).toBeInTheDocument();
  });

  it('should show "You reposted" when current user reposted', () => {
    const repostedData = { ...mockTweetData, isRepostedByMe: true };
    render(
      <QueryClientProvider client={queryClient}>
        <Tweet data={repostedData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test tweet text')).toBeInTheDocument();
  });
});
