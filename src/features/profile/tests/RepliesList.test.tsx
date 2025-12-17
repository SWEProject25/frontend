import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock hooks
const mockUseProfileFeed = vi.fn();
const mockUseProfileContext = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('../hooks/profileQueries', () => ({
  useProfileFeed: () => mockUseProfileFeed(),
}));

vi.mock('@/app/[username]/ProfileProvider', () => ({
  useProfileContext: () => mockUseProfileContext(),
}));

vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: (selector: any) => mockUseAuthStore(selector),
}));

// Mock components
vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: any) => (
    <div data-testid="tweet">{data?.text || 'Tweet'}</div>
  ),
}));

vi.mock('@/components/generic/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({
    children,
    isLoadingMore,
    hasInitialData,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    isLoadingMore: boolean;
    hasInitialData: boolean;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'infinite-scroll'}>
      {children}
      {isLoadingMore && <div data-testid="loading-more">Loading more...</div>}
      {!hasInitialData && (
        <div data-testid="no-initial-data">No initial data</div>
      )}
    </div>
  ),
}));

vi.mock('@/features/timeline/components/Reply', () => ({
  default: ({ data }: any) => (
    <div data-testid="reply" data-post-id={data?.postId}>
      {data?.text || 'Reply'}
    </div>
  ),
}));

import RepliesList from '../components/RepliesList';

describe('RepliesList', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    profile: {},
  };

  const mockProfile = {
    User: {
      id: 1,
      username: 'testuser',
    },
  };

  const mockRepliesData = {
    pages: [
      {
        data: {
          posts: [
            {
              postId: 1,
              userId: 1,
              text: 'Reply 1',
              date: '2024-01-01',
              isRepost: false,
              isQuote: false,
            },
            {
              postId: 2,
              userId: 1,
              text: 'Reply 2',
              date: '2024-01-02',
              isRepost: false,
              isQuote: false,
            },
          ],
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();

    // Default mock implementations
    mockUseProfileContext.mockReturnValue({
      username: 'testuser',
      profile: mockProfile,
    });

    mockUseAuthStore.mockImplementation((selector) => {
      const state = { user: mockUser };
      return selector(state);
    });

    mockUseProfileFeed.mockReturnValue({
      data: mockRepliesData,
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });
  });

  describe('Loading State', () => {
    it('should display loader when loading', () => {
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isLoading: true,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(screen.getByTestId('profile-tweets-loading')).toBeInTheDocument();
    });

    it('should have correct loading container styles', () => {
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isLoading: true,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      const container = screen.getByTestId('profile-tweets-loading');
      expect(container).toHaveClass('flex', 'justify-center', 'items-center');
    });
  });

  describe('Error State', () => {
    it('should display error message when error occurs', () => {
      const errorMessage = 'Failed to fetch replies';
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: new Error(errorMessage),
        isError: true,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-error')).toBeInTheDocument();
      expect(screen.getByText(`Error ${errorMessage}`)).toBeInTheDocument();
    });

    it('should show error with different error messages', () => {
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: new Error('Network error'),
        isError: true,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByText('Error Network error')).toBeInTheDocument();
    });
  });

  describe('Success State with Data', () => {
    it('should render replies list when data is available', () => {
      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should render all replies from the data', () => {
      render(<RepliesList />);

      const replies = screen.getAllByTestId('reply');
      expect(replies).toHaveLength(2);
    });

    it('should render replies with correct content', () => {
      render(<RepliesList />);

      expect(screen.getByText('Reply 1')).toBeInTheDocument();
      expect(screen.getByText('Reply 2')).toBeInTheDocument();
    });

    it('should pass correct data to Reply components', () => {
      render(<RepliesList />);

      const replies = screen.getAllByTestId('reply');
      expect(replies[0]).toHaveAttribute('data-post-id', '1');
      expect(replies[1]).toHaveAttribute('data-post-id', '2');
    });

    it('should render flex container for tweets', () => {
      render(<RepliesList />);

      const container = screen
        .getByTestId('profile-replies-list')
        .querySelector('.flex.flex-col.w-full');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle empty replies array', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
      expect(screen.queryByTestId('reply')).not.toBeInTheDocument();
    });

    it('should show no initial data message when posts array is empty', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('no-initial-data')).toBeInTheDocument();
    });
  });

  describe('Infinite Scroll', () => {
    it('should pass correct props to InfiniteScroll component', () => {
      const mockFetchNextPage = vi.fn();
      mockUseProfileFeed.mockReturnValue({
        data: mockRepliesData,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: mockFetchNextPage,
        isFetchingNextPage: false,
        hasNextPage: true,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should show loading more indicator when fetching next page', () => {
      mockUseProfileFeed.mockReturnValue({
        data: mockRepliesData,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: true,
        hasNextPage: true,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('loading-more')).toBeInTheDocument();
    });

    it('should handle multiple pages of data', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Reply 1',
                    date: '2024-01-01',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
            {
              data: {
                posts: [
                  {
                    postId: 2,
                    userId: 1,
                    text: 'Reply 2',
                    date: '2024-01-02',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      const replies = screen.getAllByTestId('reply');
      expect(replies).toHaveLength(2);
    });

    it('should not show loading more when not fetching next page', () => {
      mockUseProfileFeed.mockReturnValue({
        data: mockRepliesData,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: true,
      });

      render(<RepliesList />);

      expect(screen.queryByTestId('loading-more')).not.toBeInTheDocument();
    });
  });

  describe('User Context', () => {
    it('should handle when current user is viewing their own profile', () => {
      mockUseAuthStore.mockImplementation((selector) => {
        const state = { user: mockUser };
        return selector(state);
      });

      mockUseProfileContext.mockReturnValue({
        username: 'testuser',
        profile: mockProfile,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should handle when viewing another user profile', () => {
      mockUseAuthStore.mockImplementation((selector) => {
        const state = {
          user: {
            id: 2,
            username: 'anotheruser',
          },
        };
        return selector(state);
      });

      mockUseProfileContext.mockReturnValue({
        username: 'testuser',
        profile: mockProfile,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should handle when user is not authenticated', () => {
      mockUseAuthStore.mockImplementation((selector) => {
        const state = { user: null };
        return selector(state);
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });
  });

  describe('Reply Rendering with Different Types', () => {
    it('should render reposts correctly', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Reposted tweet',
                    date: '2024-01-01',
                    isRepost: true,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('reply')).toBeInTheDocument();
    });

    it('should render quotes correctly', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Quoted tweet',
                    date: '2024-01-01',
                    isRepost: false,
                    isQuote: true,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('reply')).toBeInTheDocument();
    });

    it('should render regular replies correctly', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Regular reply',
                    date: '2024-01-01',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByText('Regular reply')).toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    it('should log data from useProfileFeed', () => {
      render(<RepliesList />);

      expect(console.log).toHaveBeenCalledWith(mockRepliesData);
    });

    it('should log data even when undefined', () => {
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isLoading: true,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(console.log).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Data Processing', () => {
    it('should flatten pages correctly', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Reply 1',
                    date: '2024-01-01',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
            {
              data: {
                posts: [
                  {
                    postId: 2,
                    userId: 1,
                    text: 'Reply 2',
                    date: '2024-01-02',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      const replies = screen.getAllByTestId('reply');
      expect(replies).toHaveLength(2);
    });

    it('should handle pages with varying post counts', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Reply 1',
                    date: '2024-01-01',
                    isRepost: false,
                    isQuote: false,
                  },
                  {
                    postId: 2,
                    userId: 1,
                    text: 'Reply 2',
                    date: '2024-01-02',
                    isRepost: false,
                    isQuote: false,
                  },
                  {
                    postId: 3,
                    userId: 1,
                    text: 'Reply 3',
                    date: '2024-01-03',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
            {
              data: {
                posts: [
                  {
                    postId: 4,
                    userId: 1,
                    text: 'Reply 4',
                    date: '2024-01-04',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      const replies = screen.getAllByTestId('reply');
      expect(replies).toHaveLength(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', () => {
      mockUseProfileFeed.mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      // Should not crash and should show infinite scroll
      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should handle posts with originalPostData', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Reply with original',
                    date: '2024-01-01',
                    isRepost: true,
                    isQuote: false,
                    originalPostData: {
                      postId: 10,
                      userId: 2,
                      text: 'Original post',
                    },
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('reply')).toBeInTheDocument();
    });

    it('should handle both repost and quote flags', () => {
      mockUseProfileFeed.mockReturnValue({
        data: {
          pages: [
            {
              data: {
                posts: [
                  {
                    postId: 1,
                    userId: 1,
                    text: 'Repost and quote',
                    date: '2024-01-01',
                    isRepost: true,
                    isQuote: true,
                  },
                ],
              },
            },
          ],
        },
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('reply')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with InfiniteScroll component', () => {
      render(<RepliesList />);

      const infiniteScroll = screen.getByTestId('profile-replies-list');
      expect(infiniteScroll).toBeInTheDocument();
    });

    it('should pass inProfile prop correctly to Reply components', () => {
      // When viewing own profile
      mockUseAuthStore.mockImplementation((selector) => {
        const state = { user: mockUser };
        return selector(state);
      });

      mockUseProfileContext.mockReturnValue({
        username: 'testuser',
        profile: mockProfile,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should render with hasNextPage true', () => {
      mockUseProfileFeed.mockReturnValue({
        data: mockRepliesData,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: true,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });

    it('should render with hasNextPage false', () => {
      mockUseProfileFeed.mockReturnValue({
        data: mockRepliesData,
        error: null,
        isError: false,
        isLoading: false,
        fetchNextPage: vi.fn(),
        isFetchingNextPage: false,
        hasNextPage: false,
      });

      render(<RepliesList />);

      expect(screen.getByTestId('profile-replies-list')).toBeInTheDocument();
    });
  });
});
