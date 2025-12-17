import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockSetSelectedTab = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  usePathname: () => '/search',
}));

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useActions: () => ({
    selectSearchTab: mockSetSelectedTab,
  }),
  useSelectedSearchTab: vi.fn(() => 'top'),
  useSearch: vi.fn(() => 'test search'),
}));

// Mock timeline store
vi.mock('@/features/timeline/store/useTimelineStore', () => ({
  useSearch: vi.fn(() => 'test'),
  useSearchAction: vi.fn(() => ({
    setSearch: vi.fn(),
    setIsOpen: vi.fn(),
  })),
  useSearchIsopen: vi.fn(() => false),
}));

// Mock timeline queries
vi.mock('@/features/timeline/hooks/timelineQueries', () => ({
  useSearchProfile: vi.fn(() => ({
    data: null,
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
vi.mock('@/features/timeline/hooks/useDebounce', () => ({
  default: vi.fn((value: string) => value),
}));

// Mock Tabs component
vi.mock('@/components/generic/Tabs', () => ({
  default: ({
    tabs,
    selectedValue,
    onClick,
    'data-testid': testId,
  }: {
    tabs: { title: string; value: string }[];
    selectedValue: string;
    onClick: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={testId}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          data-testid={`tab-${tab.value}`}
          onClick={() => onClick(tab.value)}
          className={selectedValue === tab.value ? 'selected' : ''}
        >
          {tab.title}
        </button>
      ))}
    </div>
  ),
}));

// Mock SearchBar component
vi.mock('./SearchBar', () => ({
  default: () => <div data-testid="search-bar">Search Bar</div>,
}));

// Mock constants
vi.mock('../constants/tabs', () => ({
  searchTabs: [
    { title: 'Top', value: 'top' },
    { title: 'Latest', value: 'latest' },
  ],
  TOP_TAB: 'top',
}));

import SearchHeader from '../components/SearchHeader';
import { useSearch } from '../store/useExploreStore';

describe('SearchHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the SearchHeader component', () => {
    render(<SearchHeader />);
    expect(
      screen.getByTestId('timeline-explore-search-header')
    ).toBeInTheDocument();
  });

  it('should render SearchBar component', () => {
    render(<SearchHeader />);
    // SearchBar renders the back icon and search profile
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render Tabs component', () => {
    render(<SearchHeader />);
    expect(
      screen.getByTestId('timeline-explore-search-tabs')
    ).toBeInTheDocument();
  });

  it('should navigate to Top tab with correct params', () => {
    render(<SearchHeader />);
    const topTab = screen.getByTestId('tab-top');
    fireEvent.click(topTab);

    expect(mockPush).toHaveBeenCalledWith('/search?q=test+search');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('top');
  });

  it('should navigate to Latest tab with correct params', () => {
    render(<SearchHeader />);
    const latestTab = screen.getByTestId('tab-latest');
    fireEvent.click(latestTab);

    expect(mockPush).toHaveBeenCalledWith('/search?q=test+search&f=live');
    expect(mockSetSelectedTab).toHaveBeenCalledWith('latest');
  });

  it('should have sticky positioning', () => {
    render(<SearchHeader />);
    const header = screen.getByTestId('timeline-explore-search-header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });

  it('should have backdrop blur effect', () => {
    render(<SearchHeader />);
    const header = screen.getByTestId('timeline-explore-search-header');
    expect(header).toHaveClass('backdrop-blur-md');
  });

  it('should use different search query', () => {
    vi.mocked(useSearch).mockReturnValue('different search');
    render(<SearchHeader />);
    const topTab = screen.getByTestId('tab-top');
    fireEvent.click(topTab);

    expect(mockPush).toHaveBeenCalledWith('/search?q=different+search');
  });

  it('should handle empty search query', () => {
    vi.mocked(useSearch).mockReturnValue('');
    render(<SearchHeader />);
    const topTab = screen.getByTestId('tab-top');
    fireEvent.click(topTab);

    expect(mockPush).toHaveBeenCalledWith('/search?q=');
  });

  it('should handle special characters in search', () => {
    vi.mocked(useSearch).mockReturnValue('#hashtag');
    render(<SearchHeader />);
    const topTab = screen.getByTestId('tab-top');
    fireEvent.click(topTab);

    expect(mockPush).toHaveBeenCalledWith('/search?q=%23hashtag');
  });
});
