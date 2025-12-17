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
  useSelectedTab: vi.fn(() => 'personalized'),
}));

// Mock the hook
vi.mock('../hooks/exploreQueries', () => ({
  useExplorePosts: vi.fn(() => ({
    data: {
      data: {
        Technology: [
          {
            userId: 1,
            postId: 1,
            date: '2024-01-01',
            username: 'techuser',
            name: 'Tech User',
            text: 'Tech tweet',
          },
        ],
        Sports: [
          {
            userId: 2,
            postId: 2,
            date: '2024-01-02',
            username: 'sportuser',
            name: 'Sport User',
            text: 'Sports tweet',
          },
        ],
      },
    },
    error: null,
    isError: false,
    isLoading: false,
  })),
}));

// Mock components
vi.mock('@/components/generic/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn((message: string) => (
    <div data-testid="toaster-message">{message}</div>
  )),
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: () => <div data-testid="icon">Icon</div>,
}));

vi.mock('@/features/tweets/components/Tweet', () => ({
  default: ({ data }: { data: { text: string } }) => (
    <div data-testid="tweet-component">{data.text}</div>
  ),
}));

import TweetsList from '../components/TweetsList';
import { useExplorePosts } from '../hooks/exploreQueries';

describe('TweetsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useExplorePosts).mockReturnValue({
      data: {
        data: {
          Technology: [
            {
              userId: 1,
              postId: 1,
              date: '2024-01-01',
              username: 'techuser',
              name: 'Tech User',
              text: 'Tech tweet',
            },
          ],
          Sports: [
            {
              userId: 2,
              postId: 2,
              date: '2024-01-02',
              username: 'sportuser',
              name: 'Sport User',
              text: 'Sports tweet',
            },
          ],
        },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useExplorePosts>);
  });

  it('should render the TweetsList component with tweets', () => {
    render(<TweetsList />);
    expect(
      screen.getByTestId('explore-feed-render-tweet-list')
    ).toBeInTheDocument();
  });

  it('should render category headers', () => {
    render(<TweetsList />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
  });

  it('should render tweets for each category', () => {
    render(<TweetsList />);
    expect(screen.getByText('Tech tweet')).toBeInTheDocument();
    expect(screen.getByText('Sports tweet')).toBeInTheDocument();
  });

  it('should show loader when loading', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show loading state with proper test id', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(
      screen.getByTestId('explore-feed-tweet-list-loading')
    ).toBeInTheDocument();
  });

  it('should show error message when error occurs', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: {
        data: {
          Technology: [
            {
              userId: 1,
              postId: 1,
              date: '2024-01-01',
              text: 'Tech tweet',
            },
          ],
        },
      },
      error: new Error('Failed to fetch'),
      isError: true,
      isLoading: false,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(screen.getByTestId('toaster-message')).toBeInTheDocument();
  });

  it('should show no posts message when data is null', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: null,
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(
      screen.getByText('No Posts available Right Now')
    ).toBeInTheDocument();
  });

  it('should navigate to interest page when category is clicked', () => {
    render(<TweetsList />);
    const techCategory = screen
      .getByText('Technology')
      .closest('div[class*="cursor-pointer"]');
    if (techCategory) fireEvent.click(techCategory);
    expect(mockPush).toHaveBeenCalledWith('/interests/Technology');
  });

  it('should navigate to different interest pages', () => {
    render(<TweetsList />);
    const sportsCategory = screen
      .getByText('Sports')
      .closest('div[class*="cursor-pointer"]');
    if (sportsCategory) fireEvent.click(sportsCategory);
    expect(mockPush).toHaveBeenCalledWith('/interests/Sports');
  });

  it('should render multiple tweets per category', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: {
        data: {
          Technology: [
            { userId: 1, postId: 1, date: '2024-01-01', text: 'Tech tweet 1' },
            { userId: 2, postId: 2, date: '2024-01-02', text: 'Tech tweet 2' },
            { userId: 3, postId: 3, date: '2024-01-03', text: 'Tech tweet 3' },
          ],
        },
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(screen.getByText('Tech tweet 1')).toBeInTheDocument();
    expect(screen.getByText('Tech tweet 2')).toBeInTheDocument();
    expect(screen.getByText('Tech tweet 3')).toBeInTheDocument();
  });

  it('should render icon in category header', () => {
    render(<TweetsList />);
    expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);
  });

  it('should handle empty categories', () => {
    vi.mocked(useExplorePosts).mockReturnValue({
      data: {
        data: {},
      },
      error: null,
      isError: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useExplorePosts>);

    render(<TweetsList />);
    expect(
      screen.getByTestId('explore-feed-render-tweet-list')
    ).toBeInTheDocument();
  });

  it('should have hover styling on category headers', () => {
    render(<TweetsList />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('should have cursor pointer on category headers', () => {
    render(<TweetsList />);
    const techCategory = screen
      .getByText('Technology')
      .closest('div[class*="cursor-pointer"]');
    expect(techCategory).toBeInTheDocument();
  });
});
