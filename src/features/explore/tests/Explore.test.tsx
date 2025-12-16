import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock the store
vi.mock('../store/useExploreStore', () => ({
  useSelectedTab: vi.fn(() => 'personalized'),
}));

// Mock the hooks
vi.mock('../hooks/exploreQueries', () => ({
  useTrendingFeed: vi.fn(() => ({
    data: {
      data: { trending: [{ tag: '#test', totalPosts: 100 }] },
      metadata: { HashtagsCount: 1, category: 'general' },
    },
    error: null,
    isError: false,
    isLoading: false,
  })),
  useExplorePosts: vi.fn(() => ({
    data: {
      data: {
        Technology: [
          {
            userId: 1,
            postId: 1,
            date: '2024-01-01',
            text: 'Test tweet',
          },
        ],
      },
    },
    error: null,
    isError: false,
    isLoading: false,
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/explore',
}));

vi.mock('@/components/generic/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('../constants/tabs', () => ({
  FOR_YOU_TAB: 'personalized',
  TRENDING_TAB: 'general',
  TOP_TAB: 'top',
  NEWS_TAB: 'news',
  SPORTS_TAB: 'sports',
  ENTERTAINMENT_TAB: 'entertainment',
}));

vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: { data: { text: string } }) => (
    <div data-testid="tweet-component">{data.text}</div>
  ),
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: () => <div data-testid="icon">Icon</div>,
}));

import Explore from '../components/Explore';
import { useSelectedTab } from '../store/useExploreStore';
import { useTrendingFeed } from '../hooks/exploreQueries';

describe('Explore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSelectedTab).mockReturnValue('personalized');
    vi.mocked(useTrendingFeed).mockReturnValue({
      data: {
        data: { trending: [{ tag: '#test', totalPosts: 100 }] },
        metadata: { HashtagsCount: 1, category: 'general' },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useTrendingFeed>);
  });

  it('should render ForYou content when FOR_YOU_TAB is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('personalized');
    render(<Explore />);
    // ForYou renders TweetsList and Trendings
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('explore-feed-render-tweet-list')
    ).toBeInTheDocument();
  });

  it('should render Trendings content when a different tab is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('general');
    render(<Explore />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render component without crashing', () => {
    const { container } = render(<Explore />);
    expect(container).toBeTruthy();
  });

  it('should render Trendings when TRENDING_TAB is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('general');
    render(<Explore />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render Trendings when NEWS_TAB is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('news');
    render(<Explore />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render Trendings when SPORTS_TAB is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('sports');
    render(<Explore />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render Trendings when ENTERTAINMENT_TAB is selected', async () => {
    vi.mocked(useSelectedTab).mockReturnValue('entertainment');
    render(<Explore />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });
});
