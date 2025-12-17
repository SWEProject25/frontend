import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockFetchNextPage = vi.fn();

// Mock useTimelineFeed
vi.mock('../hooks/timelineQueries', () => ({
  useTimelineFeed: vi.fn(() => ({
    data: {
      pages: [
        {
          data: {
            posts: [
              { userId: 1, postId: 1, date: '2024-01-01', text: 'Test tweet' },
            ],
          },
        },
      ],
    },
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: mockFetchNextPage,
    isError: false,
    error: null,
  })),
}));

// Mock Tweet component
vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: { data: { text?: string } }) => (
    <div data-testid="tweet">{data?.text || 'Tweet'}</div>
  ),
}));

// Mock useTweetStore
vi.mock('@/features/tweets/store/tweetStore', () => ({
  useTweetStore: vi.fn(() => ({})),
}));

// Mock InfiniteScroll
vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({
    children,
    loadMore,
    hasMoreData,
  }: {
    children: React.ReactNode;
    loadMore: () => void;
    hasMoreData: boolean;
  }) => (
    <div data-testid="infinite-scroll" data-has-more={hasMoreData}>
      {children}
      <button data-testid="load-more" onClick={loadMore}>
        Load More
      </button>
    </div>
  ),
}));

// Mock Loader
vi.mock('@/components/generic/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock toasterMessage
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import TweetList from '../components/TweetList';
import { useTimelineFeed } from '../hooks/timelineQueries';

describe('TweetList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tweet list container', () => {
    render(<TweetList />);
    expect(screen.getByTestId('tweet-list-container')).toBeInTheDocument();
  });

  it('should render infinite scroll component', () => {
    render(<TweetList />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should render render-tweet-list', () => {
    render(<TweetList />);
    expect(screen.getByTestId('render-tweet-list')).toBeInTheDocument();
  });

  it('should render tweets when data available', () => {
    render(<TweetList />);
    expect(screen.getByTestId('tweet')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show loading state when fetching without initial data', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: {
        pages: [{ data: { posts: [] } }],
      },
      isLoading: false,
      isFetching: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show error state when isError is true', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: true,
      error: { message: 'Error loading timeline' },
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(
      screen.queryByTestId('tweet-list-container')
    ).not.toBeInTheDocument();
  });

  it('should render multiple tweets', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                { userId: 1, postId: 1, date: '2024-01-01', text: 'Tweet 1' },
                { userId: 2, postId: 2, date: '2024-01-02', text: 'Tweet 2' },
                { userId: 3, postId: 3, date: '2024-01-03', text: 'Tweet 3' },
              ],
            },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(screen.getAllByTestId('tweet')).toHaveLength(3);
  });

  it('should render multiple pages of tweets', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                { userId: 1, postId: 1, date: '2024-01-01', text: 'Page 1' },
              ],
            },
          },
          {
            data: {
              posts: [
                { userId: 2, postId: 2, date: '2024-01-02', text: 'Page 2' },
              ],
            },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(screen.getAllByTestId('tweet')).toHaveLength(2);
  });

  it('should indicate hasMoreData when hasNextPage is true', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                { userId: 1, postId: 1, date: '2024-01-01', text: 'Tweet' },
              ],
            },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    const infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll.getAttribute('data-has-more')).toBe('true');
  });

  it('should not show hasMoreData when isFetchingNextPage is true', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                { userId: 1, postId: 1, date: '2024-01-01', text: 'Tweet' },
              ],
            },
          },
        ],
      },
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: true,
      hasNextPage: true,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    const infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll.getAttribute('data-has-more')).toBe('false');
  });

  it('should handle empty data gracefully', () => {
    vi.mocked(useTimelineFeed).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: mockFetchNextPage,
      isError: false,
      error: null,
    } as ReturnType<typeof useTimelineFeed>);

    render(<TweetList />);
    expect(screen.getByTestId('tweet-list-container')).toBeInTheDocument();
  });
});
