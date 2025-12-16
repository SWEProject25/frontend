import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockFetchNextPage = vi.fn();

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useInterest: vi.fn(() => 'Technology'),
}));

// Mock the hook
vi.mock('../hooks/exploreQueries', () => ({
  useExploreInterest: vi.fn(() => ({
    data: {
      pages: [
        {
          data: {
            posts: [
              {
                userId: 1,
                postId: 1,
                date: '2024-01-01',
                username: 'testuser',
                name: 'Test User',
                text: 'Test tweet',
                avatar: 'avatar.jpg',
                likesCount: 10,
                retweetsCount: 5,
                commentsCount: 2,
                isLikedByMe: false,
                isFollowedByMe: false,
                isRepostedByMe: false,
                verified: false,
                mentions: [],
                media: [],
              },
            ],
          },
        },
      ],
    },
    error: null,
    isError: false,
    isLoading: false,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    hasNextPage: true,
  })),
}));

// Mock components
vi.mock('@/components/generic', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId}>{children}</div>,
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn((message: string) => (
    <div data-testid="toaster-message">{message}</div>
  )),
}));

vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: { data: { text: string } }) => (
    <div data-testid="tweet-component">{data.text}</div>
  ),
}));

import Interest from '../components/Interest';
import { useExploreInterest } from '../hooks/exploreQueries';

describe('Interest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Interest component with tweets', () => {
    render(<Interest />);
    expect(screen.getByTestId('tweet-interest-list')).toBeInTheDocument();
  });

  it('should render tweets when data is available', () => {
    render(<Interest />);
    expect(screen.getByTestId('tweet-component')).toBeInTheDocument();
    expect(screen.getByText('Test tweet')).toBeInTheDocument();
  });

  it('should render tweet list container', () => {
    render(<Interest />);
    expect(
      screen.getByTestId('render-tweet-interest-list')
    ).toBeInTheDocument();
  });

  it('should show loader when loading', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
    } as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show loading state with proper test id', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
    } as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(
      screen.getByTestId('tweet-list-interest-loading')
    ).toBeInTheDocument();
  });

  it('should show error message when error occurs', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                {
                  userId: 1,
                  postId: 1,
                  date: '2024-01-01',
                  text: 'Test tweet',
                },
              ],
            },
          },
        ],
      },
      error: new Error('Failed to fetch'),
      isError: true,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
    } as unknown as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(screen.getByTestId('toaster-message')).toBeInTheDocument();
  });

  it('should show no interest message when no data available', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
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
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
    } as unknown as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(
      screen.getByText('No such Interest available Right Now')
    ).toBeInTheDocument();
  });

  it('should render multiple tweets', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                {
                  userId: 1,
                  postId: 1,
                  date: '2024-01-01',
                  text: 'First tweet',
                },
                {
                  userId: 2,
                  postId: 2,
                  date: '2024-01-02',
                  text: 'Second tweet',
                },
              ],
            },
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: true,
    } as unknown as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(screen.getByText('First tweet')).toBeInTheDocument();
    expect(screen.getByText('Second tweet')).toBeInTheDocument();
  });

  it('should handle multiple pages of data', () => {
    vi.mocked(useExploreInterest).mockReturnValue({
      data: {
        pages: [
          {
            data: {
              posts: [
                {
                  userId: 1,
                  postId: 1,
                  date: '2024-01-01',
                  text: 'Page 1 tweet',
                },
              ],
            },
          },
          {
            data: {
              posts: [
                {
                  userId: 2,
                  postId: 2,
                  date: '2024-01-02',
                  text: 'Page 2 tweet',
                },
              ],
            },
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: true,
    } as unknown as ReturnType<typeof useExploreInterest>);

    render(<Interest />);
    expect(screen.getByText('Page 1 tweet')).toBeInTheDocument();
    expect(screen.getByText('Page 2 tweet')).toBeInTheDocument();
  });
});
