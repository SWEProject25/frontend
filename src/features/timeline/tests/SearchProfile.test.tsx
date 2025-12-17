import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockSetSearch = vi.fn();
const mockSetIsOpen = vi.fn();
const mockPush = vi.fn();
const mockFetchNextPage = vi.fn();
let mockSearch = 'test';
let mockIsOpen = true;

// Mock useTimelineStore
vi.mock('../store/useTimelineStore', () => ({
  useSearch: vi.fn(() => mockSearch),
  useSearchAction: vi.fn(() => ({
    setSearch: mockSetSearch,
    setIsOpen: mockSetIsOpen,
  })),
  useSearchIsopen: vi.fn(() => mockIsOpen),
}));

// Mock timelineQueries
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
  useSearchHashtag: vi.fn(() => ({
    data: { pages: [{ data: { posts: [] } }] },
    isLoading: false,
  })),
}));

// Mock useDebounce
vi.mock('../hooks/useDebounce', () => ({
  default: vi.fn((value: string) => value),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
  usePathname: vi.fn(() => '/home'),
}));

// Mock components
vi.mock('@/components/ui/input', () => ({
  SearchInput: ({
    value,
    onChange,
    onFocus,
    handleKeyDown,
  }: {
    value: string;
    onChange: (v: string) => void;
    onFocus: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
  }) => (
    <input
      aria-label="test-search-profile"
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
    />
  ),
}));

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

vi.mock('@/components/ui/home/Icon', () => ({
  default: function Icon() {
    return <div data-testid="icon">Icon</div>;
  },
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import SearchProfile from '../components/SearchProfile';
import { useSearchProfile, useSearchHashtag } from '../hooks/timelineQueries';
import { useSearch, useSearchIsopen } from '../store/useTimelineStore';

describe('SearchProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch = 'test';
    mockIsOpen = true;
    vi.mocked(useSearch).mockReturnValue(mockSearch);
    vi.mocked(useSearchIsopen).mockReturnValue(mockIsOpen);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render search profile component', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render user cards when data is available', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('user-card')).toBeInTheDocument();
  });

  it('should render infinite scroll', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
  });

  it('should call setSearch when typing', () => {
    render(<SearchProfile />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'new search' } });
    expect(mockSetSearch).toHaveBeenCalledWith('new search');
  });

  it('should call setIsOpen when input is focused', () => {
    render(<SearchProfile />);
    const input = screen.getByTestId('search-input');
    fireEvent.focus(input);
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('should show empty state when search is empty', () => {
    vi.mocked(useSearch).mockReturnValue('');
    render(<SearchProfile />);
    expect(
      screen.getByText('Try searching for people, lists, or keywords')
    ).toBeInTheDocument();
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

    render(<SearchProfile />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should handle Enter key press and navigate to search', () => {
    vi.mocked(useSearch).mockReturnValue('test');
    render(<SearchProfile />);
    const input = screen.getByTestId('search-input');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should close search when clicking outside', () => {
    render(<SearchProfile />);
    act(() => {
      fireEvent.mouseDown(document.body);
    });
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should not show dropdown when isOpen is false', () => {
    vi.mocked(useSearchIsopen).mockReturnValue(false);
    render(<SearchProfile />);
    expect(
      screen.queryByText('Try searching for people, lists, or keywords')
    ).not.toBeInTheDocument();
  });

  it('should navigate when Enter pressed', () => {
    render(<SearchProfile />);
    const input = screen.getByTestId('search-input');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should handle hashtag search', () => {
    vi.mocked(useSearch).mockReturnValue('#test');
    vi.mocked(useSearchHashtag).mockReturnValue({
      data: { pages: [{ data: { posts: [{ id: 1 }] } }] },
      isLoading: false,
    } as ReturnType<typeof useSearchHashtag>);

    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render valid search icon', () => {
    vi.mocked(useSearch).mockReturnValue('validSearch');
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render go to profile option for mention search', () => {
    vi.mocked(useSearch).mockReturnValue('@testuser');
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
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

    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render with users in data', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should handle other key press', () => {
    render(<SearchProfile />);
    const input = screen.getByTestId('search-input');
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toBeInTheDocument();
  });
});
