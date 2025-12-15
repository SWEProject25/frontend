import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Since TweetFeed is an async server component, we test TweetList directly
// which is what TweetFeed renders

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
    fetchNextPage: vi.fn(),
    isError: false,
    error: null,
  })),
}));

// Mock Tweet component
vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: any) => (
    <div data-testid="tweet">{data?.text || 'Tweet'}</div>
  ),
}));

// Mock useTweetStore
vi.mock('@/features/tweets/store/tweetStore', () => ({
  useTweetStore: vi.fn(() => ({})),
}));

// Mock InfiniteScroll
vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({ children }: any) => (
    <div data-testid="infinite-scroll">{children}</div>
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

describe('TweetFeed (via TweetList)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render tweet list container', () => {
    render(<TweetList />);
    expect(screen.getByTestId('tweet-list-container')).toBeInTheDocument();
  });

  it('should render tweets from feed', () => {
    render(<TweetList />);
    expect(screen.getByTestId('tweet')).toBeInTheDocument();
  });

  it('should render infinite scroll', () => {
    render(<TweetList />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should show tweet content', () => {
    render(<TweetList />);
    expect(screen.getByText('Test tweet')).toBeInTheDocument();
  });
});
