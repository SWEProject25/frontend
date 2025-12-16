import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

const mockPush = vi.fn();

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/explore',
}));

// Mock constants
vi.mock('../constants/tabs', () => ({
  FOR_YOU_TAB: 'personalized',
  TRENDING_TAB: 'general',
  TOP_TAB: 'top',
  NEWS_TAB: 'news',
  SPORTS_TAB: 'sports',
  ENTERTAINMENT_TAB: 'entertainment',
}));

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useSelectedTab: vi.fn(() => 'general'),
}));

// Mock the hook
vi.mock('../hooks/exploreQueries', () => ({
  useTrendingFeed: vi.fn(() => ({
    data: {
      data: {
        trending: [
          { tag: '#trending1', totalPosts: 1000 },
          { tag: '#trending2', totalPosts: 500 },
        ],
      },
      metadata: {
        HashtagsCount: 2,
        category: 'general',
      },
    },
    error: null,
    isError: false,
    isLoading: false,
  })),
}));

// Mock components
vi.mock('@/components/generic', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn((message: string) => (
    <div data-testid="toaster-message">{message}</div>
  )),
}));

import Trendings from '../components/Trendings';
import { useTrendingFeed } from '../hooks/exploreQueries';

describe('Trendings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: {
        data: {
          trending: [
            { tag: '#trending1', totalPosts: 1000 },
            { tag: '#trending2', totalPosts: 500 },
          ],
        },
        metadata: {
          HashtagsCount: 2,
          category: 'general',
        },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useTrendingFeed>);
  });

  it('should render the Trendings component with trends', () => {
    render(<Trendings />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render trend items when data is available', () => {
    render(<Trendings />);
    expect(screen.getByText('#trending1')).toBeInTheDocument();
    expect(screen.getByText('#trending2')).toBeInTheDocument();
  });

  it('should display trend tags', () => {
    render(<Trendings />);
    expect(screen.getByText('#trending1')).toBeInTheDocument();
    expect(screen.getByText('#trending2')).toBeInTheDocument();
  });

  it('should show loader when loading', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
    } as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show loading state with proper test id', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
    } as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    expect(
      screen.getByTestId('explore-feed-trending-list-loading')
    ).toBeInTheDocument();
  });

  it('should show error message when error occurs', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: undefined,
      error: new Error('Failed to fetch'),
      isError: true,
      isLoading: false,
    } as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    expect(screen.getByTestId('toaster-message')).toBeInTheDocument();
  });

  it('should show no trends message when HashtagsCount is 0', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: {
        data: {
          trending: [],
        },
        metadata: {
          HashtagsCount: 0,
          category: 'general',
        },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    expect(
      screen.getByText('Trends are not available yet')
    ).toBeInTheDocument();
  });

  it('should navigate to search when trend is clicked', () => {
    render(<Trendings />);
    const trend = screen
      .getByText('#trending1')
      .closest('div[class*="cursor-pointer"]');
    if (trend) fireEvent.click(trend);
    expect(mockPush).toHaveBeenCalledWith('/search?q=%23trending1');
  });

  it('should navigate with different trend tags', () => {
    render(<Trendings />);
    const trend = screen
      .getByText('#trending2')
      .closest('div[class*="cursor-pointer"]');
    if (trend) fireEvent.click(trend);
    expect(mockPush).toHaveBeenCalledWith('/search?q=%23trending2');
  });

  it('should render many trends', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: {
        data: {
          trending: [
            { tag: '#trend1', totalPosts: 100 },
            { tag: '#trend2', totalPosts: 200 },
            { tag: '#trend3', totalPosts: 300 },
            { tag: '#trend4', totalPosts: 400 },
            { tag: '#trend5', totalPosts: 500 },
          ],
        },
        metadata: {
          HashtagsCount: 5,
          category: 'general',
        },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    expect(screen.getByText('#trend1')).toBeInTheDocument();
    expect(screen.getByText('#trend5')).toBeInTheDocument();
  });

  it('should handle undefined data gracefully', () => {
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useTrendingFeed>);

    render(<Trendings />);
    // Should not crash when data is undefined
    expect(screen.queryByText('#trending1')).not.toBeInTheDocument();
  });
});
