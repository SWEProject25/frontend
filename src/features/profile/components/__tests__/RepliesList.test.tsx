import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RepliesList from '../RepliesList';

// Mocks
vi.mock('../hooks/profileQueries', () => ({
  useProfileFeed: vi.fn(),
}));
vi.mock('@/components/generic/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-loader">Loading...</div>,
}));
vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="mock-infinite-scroll">{children}</div>
  ),
}));
vi.mock('@/app/[username]/ProfileProvider', () => ({
  useProfileContext: () => ({ username: 'testuser' }),
}));
vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: () => ({ user: { username: 'testuser' } }),
}));
vi.mock('@/features/timeline/components/Reply', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid={`reply-${props.data.postId}`}>{props.data.text}</div>
  ),
}));

const { useProfileFeed } = require('../hooks/profileQueries');

describe('RepliesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader when loading', () => {
    useProfileFeed.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: undefined,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });
    render(<RepliesList />);
    expect(screen.getByTestId('mock-loader')).toBeInTheDocument();
  });

  it('renders error when error', () => {
    useProfileFeed.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: 'Failed to load' },
      data: undefined,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });
    render(<RepliesList />);
    expect(screen.getByTestId('profile-replies-error')).toHaveTextContent(
      'Error Failed to load'
    );
  });

  it('renders replies in infinite scroll when data is present', () => {
    useProfileFeed.mockReturnValue({
      isLoading: false,
      isError: false,
      error: undefined,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      data: {
        pages: [
          [
            {
              data: {
                posts: [
                  {
                    postId: '1',
                    userId: 'u1',
                    text: 'Reply 1',
                    isRepost: false,
                    isQuote: false,
                  },
                  {
                    postId: '2',
                    userId: 'u2',
                    text: 'Reply 2',
                    isRepost: false,
                    isQuote: false,
                  },
                ],
              },
            },
          ],
        ],
      },
    });
    render(<RepliesList />);
    expect(screen.getByTestId('mock-infinite-scroll')).toBeInTheDocument();
    expect(screen.getByTestId('reply-1')).toHaveTextContent('Reply 1');
    expect(screen.getByTestId('reply-2')).toHaveTextContent('Reply 2');
  });

  it('renders nothing if no posts', () => {
    useProfileFeed.mockReturnValue({
      isLoading: false,
      isError: false,
      error: undefined,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      data: {
        pages: [
          [
            {
              data: {
                posts: [],
              },
            },
          ],
        ],
      },
    });
    render(<RepliesList />);
    expect(screen.getByTestId('mock-infinite-scroll')).toBeInTheDocument();
    expect(screen.queryByTestId('reply-1')).not.toBeInTheDocument();
  });
});
