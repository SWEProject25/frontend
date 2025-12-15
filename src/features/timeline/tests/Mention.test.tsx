import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => '',
    useMention: () => 'test',
    useCurrentKey: () => '',
    useIsOpen: () => true,
    useActions: () => ({
      setTweetText: vi.fn(),
      setMention: vi.fn(),
      setIsOpen: vi.fn(),
      setIsDone: vi.fn(),
      setKeyDown: vi.fn(),
    }),
  })),
}));

// Mock useSearchProfile
vi.mock('../hooks/timelineQueries', () => ({
  useSearchProfile: vi.fn(() => ({
    data: {
      pages: [
        {
          data: [{ User: { username: 'testuser' }, user_id: 1 }],
          metadata: { total: 1, limit: 10 },
        },
      ],
    },
    isLoading: false,
    fetchNextPage: vi.fn(),
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
  default: ({ username }: any) => <div data-testid="user-card">{username}</div>,
}));

vi.mock('@/components/generic', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/InfiniteScroll', () => ({
  default: ({ children }: any) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import Mention from '../components/Mention';

describe('Mention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
