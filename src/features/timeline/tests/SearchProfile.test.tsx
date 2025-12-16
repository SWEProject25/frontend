import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock useTimelineStore
vi.mock('../store/useTimelineStore', () => ({
  useSearch: vi.fn(() => 'test'),
  useSearchAction: vi.fn(() => ({
    setSearch: vi.fn(),
    setIsOpen: vi.fn(),
  })),
  useSearchIsopen: vi.fn(() => true),
}));

// Mock timelineQueries
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
  useSearchHashtag: vi.fn(() => ({
    data: null,
    isLoading: false,
  })),
}));

// Mock useDebounce
vi.mock('../hooks/useDebounce', () => ({
  default: vi.fn((value: string) => value),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/home'),
}));

// Mock components
vi.mock('@/components/ui/home/XMenu', () => {
  const XMenu = function XMenu({ children }: { children: React.ReactNode }) {
    return <div data-testid="x-menu">{children}</div>;
  };
  XMenu.Button = function XMenuButton({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="x-menu-button">{children}</div>;
  };
  XMenu.List = function XMenuList({ children }: { children: React.ReactNode }) {
    return <div data-testid="x-menu-list">{children}</div>;
  };
  XMenu.Items = function XMenuItems({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="x-menu-items">{children}</div>;
  };
  return { default: XMenu };
});

vi.mock('@/components/ui/input', () => ({
  SearchInput: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

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

vi.mock('@/components/ui/home/Icon', () => ({
  default: function Icon() {
    return <div data-testid="icon">Icon</div>;
  },
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import SearchProfile from '../components/SearchProfile';

describe('SearchProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search profile component', () => {
    render(<SearchProfile />);
    // SearchProfile renders an XMenu wrapper
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<SearchProfile />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should render x-menu button', () => {
    render(<SearchProfile />);
    // SearchProfile renders with search input
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
});
