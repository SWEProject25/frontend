import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Actions from '../components/Actions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/features/timeline/store/useTimelineStore', () => ({
  useShowCheckModal: () => false,
  useActions: () => ({
    setParentId: vi.fn(),
    setPostType: vi.fn(),
  }),
}));

vi.mock('../hooks/tweetQueries', () => ({
  useToggleLikeTweet: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useToggleRepostTweet: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

const mockStats = {
  postId: 1,
  isRepost: false,
  isQuote: false,
  userId: 1,
  type: 'POST',
  parentId: undefined,
  likesCount: 10,
  retweetsCount: 5,
  commentsCount: 3,
  isLikedByMe: false,
  isRepostedByMe: false,
};

describe('Actions Component', () => {
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

  const renderActions = (stats = mockStats) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Actions stats={stats} />
      </QueryClientProvider>
    );
  };

  it('should render all action buttons', () => {
    renderActions();

    expect(screen.getByTestId('tweet-actions')).toBeInTheDocument();
  });

  it('should display correct counts', () => {
    renderActions();

    expect(screen.getByText('3')).toBeInTheDocument(); // comments
    expect(screen.getByText('5')).toBeInTheDocument(); // retweets
    expect(screen.getByText('10')).toBeInTheDocument(); // likes
  });
});
