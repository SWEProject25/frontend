import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock next/navigation first
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/home'),
}));

// Mock explore store
vi.mock('@/features/explore/store/useExploreStore', () => ({
  useSearchExplore: vi.fn(() => ''),
  useActions: vi.fn(() => ({
    setSearchQuery: vi.fn(),
  })),
}));

// Mock child components
vi.mock('../components/AddTweet', () => ({
  default: ({ type, persistent }: { type?: string; persistent?: boolean }) => (
    <div data-testid="add-tweet" data-type={type} data-persistent={persistent}>
      AddTweet
    </div>
  ),
}));

vi.mock('../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../components/TweetList', () => ({
  default: () => <div data-testid="tweet-list">TweetList</div>,
}));

vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ path }: { path: string }) => (
    <svg data-testid="icon">
      <path d={path} />
    </svg>
  ),
}));

vi.mock('@/components/generic', () => ({
  Avatar: function Avatar({
    avatarImage,
    name,
    size,
  }: {
    avatarImage?: string;
    name?: string;
    size?: string;
  }) {
    return (
      <div
        data-testid="avatar"
        data-src={avatarImage || ''}
        data-alt={name}
        data-size={size}
      />
    );
  },
}));

// Mock useTimelineStore hooks
const mockSetPopUpAvatars = vi.fn();
const mockSetFetchAvatars = vi.fn();
const mockSetNewTweets = vi.fn();

vi.mock('../store/useTimelineStore', () => ({
  default: vi.fn(),
  useActions: vi.fn(() => ({
    setPopUpAvatars: mockSetPopUpAvatars,
    setFetchAvatars: mockSetFetchAvatars,
    setNewTweets: mockSetNewTweets,
  })),
  useFetchAvatars: vi.fn(() => false),
  useNewTweets: vi.fn(() => []),
  usePopUpAvatars: vi.fn(() => []),
  useSelectedTab: vi.fn(() => 'forYou'),
}));

// Mock timelineQueries
vi.mock('../hooks/timelineQueries', () => ({
  TIMELINE_QUERY_KEYS: {
    TIMELINE_FEED_FOR_YOU: ['timeline', 'forYou'],
    TIMELINE_FEED_FOLLOWING: ['timeline', 'following'],
  },
  useAvatarsPopUp: vi.fn(() => ({
    data: null,
    error: null,
    isError: false,
    isLoading: false,
  })),
}));

// Import component after mocks
import Timeline from '../components/Timeline';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('Timeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render Timeline component', () => {
    render(<Timeline />, { wrapper });

    const timeline = screen.getByTestId('timeline');
    expect(timeline).toBeDefined();
  });

  it('should render Header component', () => {
    render(<Timeline />, { wrapper });

    const header = screen.getByTestId('header');
    expect(header).toBeDefined();
  });

  it('should render AddTweet component', () => {
    render(<Timeline />, { wrapper });

    const addTweet = screen.getByTestId('add-tweet');
    expect(addTweet).toBeDefined();
  });

  it('should render TweetList component', () => {
    render(<Timeline />, { wrapper });

    const tweetList = screen.getByTestId('tweet-list');
    expect(tweetList).toBeDefined();
  });

  it('should pass POST type to AddTweet', () => {
    render(<Timeline />, { wrapper });

    const addTweet = screen.getByTestId('add-tweet');
    expect(addTweet.getAttribute('data-type')).toBe('POST');
  });

  it('should pass persistent prop to AddTweet', () => {
    render(<Timeline />, { wrapper });

    const addTweet = screen.getByTestId('add-tweet');
    expect(addTweet.getAttribute('data-persistent')).toBe('true');
  });

  it('should not show popup when avatars is empty', () => {
    render(<Timeline />, { wrapper });

    const popupText = screen.queryByText('Posted');
    expect(popupText).toBeNull();
  });

  it('should set up IntersectionObserver', () => {
    render(<Timeline />, { wrapper });

    expect(window.IntersectionObserver).toHaveBeenCalled();
  });

  it('should have correct layout classes', () => {
    render(<Timeline />, { wrapper });

    const timeline = screen.getByTestId('timeline');
    expect(timeline.className).toContain('flex');
    expect(timeline.className).toContain('flex-col');
  });

  it('should render timeline-content container', () => {
    render(<Timeline />, { wrapper });

    const content = screen.getByTestId('timeline-content');
    expect(content).toBeDefined();
  });
});
