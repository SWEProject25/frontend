import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock state variables
let mockMention = 'test';
let mockCurrentKey = '';
let mockIsOpen = true;
const mockSetIsOpen = vi.fn();
const mockSetIsDone = vi.fn();
const mockSetKeyDown = vi.fn();
const mockFetchNextPage = vi.fn();

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => '',
    useMention: () => mockMention,
    useCurrentKey: () => mockCurrentKey,
    useIsOpen: () => mockIsOpen,
    useActions: () => ({
      setTweetText: vi.fn(),
      setMention: vi.fn(),
      setIsOpen: mockSetIsOpen,
      setIsDone: mockSetIsDone,
      setKeyDown: mockSetKeyDown,
    }),
  })),
}));

// Mock useSearchProfile
vi.mock('../hooks/timelineQueries', () => ({
  useSearchProfile: vi.fn(() => ({
    data: {
      pages: [
        {
          data: [
            {
              User: { username: 'testuser', is_verified: false },
              user_id: 1,
              name: 'Test User',
              is_followed_by_me: false,
              profile_image_url: '/test.jpg',
            },
          ],
          metadata: { total: 1, limit: 10 },
        },
      ],
    },
    isLoading: false,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    hasNextPage: false,
    isError: false,
    error: null,
  })),
}));

// Mock useDebounce
vi.mock('../hooks/useDebounce', () => ({
  default: vi.fn((value: string) => value),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

// Mock components
vi.mock('@/components/ui/UserCard', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="user-card">{name}</div>
  ),
}));

vi.mock('@/components/generic', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import Mention from '../components/Mention';
import { useSearchProfile } from '../hooks/timelineQueries';

describe('Mention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMention = 'test';
    mockCurrentKey = '';
    mockIsOpen = true;
  });

  it('should render mention component', () => {
    render(<Mention />);
    expect(
      screen.getByTestId('render-search-profile-list')
    ).toBeInTheDocument();
  });

  it('should render user card when profiles available', () => {
    render(<Mention />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  it('should render infinite scroll', () => {
    render(<Mention />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should return null when isOpen is false', () => {
    mockIsOpen = false;
    const { container } = render(<Mention />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null when mention is empty', () => {
    mockMention = '';
    const { container } = render(<Mention />);
    expect(container.firstChild).toBeNull();
  });

  it('should show loading state', () => {
    vi.mocked(useSearchProfile).mockReturnValue({
      data: undefined,
      isLoading: true,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    vi.mocked(useSearchProfile).mockReturnValue({
      data: undefined,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: true,
      error: { message: 'Error occurred' },
    } as unknown as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(
      screen.queryByTestId('render-search-profile-list')
    ).not.toBeInTheDocument();
  });

  it('should close when clicking outside', () => {
    render(<Mention />);
    act(() => {
      fireEvent.mouseDown(document.body);
    });
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should render with mention and profiles', () => {
    // Re-mock the data for this test since previous test may have changed the mock
    vi.mocked(useSearchProfile).mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                User: { username: 'testuser', is_verified: false },
                user_id: 1,
                name: 'Test User',
                is_followed_by_me: false,
                profile_image_url: '/test.jpg',
              },
            ],
            metadata: { total: 1, limit: 10 },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should handle multiple profiles', () => {
    vi.mocked(useSearchProfile).mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                User: { username: 'user1', is_verified: false },
                user_id: 1,
                name: 'User 1',
                is_followed_by_me: false,
                profile_image_url: '/1.jpg',
              },
              {
                User: { username: 'user2', is_verified: true },
                user_id: 2,
                name: 'User 2',
                is_followed_by_me: true,
                profile_image_url: '/2.jpg',
              },
            ],
            metadata: { total: 2, limit: 10 },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('should display followed users', () => {
    vi.mocked(useSearchProfile).mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                User: { username: 'followeduser', is_verified: true },
                user_id: 1,
                name: 'Followed User',
                is_followed_by_me: true,
                profile_image_url: '/followed.jpg',
              },
            ],
            metadata: { total: 1, limit: 10 },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(screen.getByText('Followed User')).toBeInTheDocument();
  });

  it('should handle empty profiles list', () => {
    vi.mocked(useSearchProfile).mockReturnValue({
      data: {
        pages: [
          {
            data: [],
            metadata: { total: 0, limit: 10 },
          },
        ],
      },
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useSearchProfile>);

    render(<Mention />);
    expect(
      screen.getByTestId('render-search-profile-list')
    ).toBeInTheDocument();
  });

  it('should render with data available', () => {
    render(<Mention />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });
});
