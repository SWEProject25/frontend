import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

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

vi.mock('../constants/tabs', () => ({
  FOR_YOU_TAB: 'personalized',
  TRENDING_TAB: 'general',
  TOP_TAB: 'top',
  NEWS_TAB: 'news',
  SPORTS_TAB: 'sports',
  ENTERTAINMENT_TAB: 'entertainment',
}));

vi.mock('../store/useExploreStore', () => ({
  useSelectedTab: vi.fn(() => 'personalized'),
}));

vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: { data: { text: string } }) => (
    <div data-testid="tweet-component">{data.text}</div>
  ),
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: () => <div data-testid="icon">Icon</div>,
}));

import ForYou from '../components/ForYou';

describe('ForYou', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the ForYou component', () => {
    render(<ForYou />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('explore-feed-render-tweet-list')
    ).toBeInTheDocument();
  });

  it('should render Trendings content', () => {
    render(<ForYou />);
    expect(
      screen.getByTestId('explore-feed-render-trending-list')
    ).toBeInTheDocument();
  });

  it('should render TweetsList content', () => {
    render(<ForYou />);
    expect(
      screen.getByTestId('explore-feed-render-tweet-list')
    ).toBeInTheDocument();
  });

  it('should have correct flex container structure', () => {
    const { container } = render(<ForYou />);
    const flexContainer = container.querySelector('.flex.flex-col.flex-1');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should render both sections in order', () => {
    const { container } = render(<ForYou />);
    const children = container.firstChild?.childNodes;
    expect(children).toHaveLength(2);
  });
});
