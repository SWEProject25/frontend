import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FullTweet from '../components/FullTweet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(public callback: IntersectionObserverCallback) {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  } as any;
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/home',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/features/authentication/hooks', () => ({
  useAuth: () => ({
    user: { id: 1 },
  }),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ user: { id: 1 } }),
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
  useGetRepliesByTweetId: () => ({
    data: { pages: [{ data: { posts: [] } }] },
    isLoading: false,
    isError: false,
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
  useGetTweetSummary: () => ({
    refetch: vi.fn().mockResolvedValue({ data: { data: 'Summary' } }),
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
    setShowCheckModal: vi.fn(),
  }),
}));

const mockData = {
  postId: 1,
  userId: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'avatar.jpg',
  text: 'Test tweet content',
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

describe('FullTweet Component', () => {
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

  it('should render tweet content', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FullTweet data={mockData} id={1} />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test tweet content')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should show loader when data is null', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FullTweet data={null} id={1} />
      </QueryClientProvider>
    );

    // Loader should be shown by checking for spinner animation
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
