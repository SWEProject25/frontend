import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
import {
  usePopUpAvatars,
  useFetchAvatars,
  useSelectedTab,
} from '../store/useTimelineStore';
import { useAvatarsPopUp } from '../hooks/timelineQueries';

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
  let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockObserve = vi.fn();
    mockUnobserve = vi.fn();

    // Mock IntersectionObserver to capture callback
    window.IntersectionObserver = vi.fn((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: vi.fn(),
      };
    }) as unknown as typeof IntersectionObserver;

    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
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
    expect(mockObserve).toHaveBeenCalled();
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

  it('should show popup when avatars is not empty and isPopUpVisible is true', () => {
    vi.mocked(usePopUpAvatars).mockReturnValue([
      { avatar: 'avatar1.jpg', name: 'User1' },
      { avatar: 'avatar2.jpg', name: 'User2' },
    ]);
    vi.mocked(useFetchAvatars).mockReturnValue(true);

    render(<Timeline />, { wrapper });

    const popupText = screen.getByText('Posted');
    expect(popupText).toBeDefined();
  });

  it('should render avatars in popup', () => {
    vi.mocked(usePopUpAvatars).mockReturnValue([
      { avatar: 'avatar1.jpg', name: 'User1' },
      { avatar: 'avatar2.jpg', name: 'User2' },
    ]);
    vi.mocked(useFetchAvatars).mockReturnValue(true);

    render(<Timeline />, { wrapper });

    const avatars = screen.getAllByTestId('avatar');
    expect(avatars.length).toBe(2);
  });

  it('should click popup to scroll to top and clear avatars', () => {
    vi.mocked(usePopUpAvatars).mockReturnValue([
      { avatar: 'avatar1.jpg', name: 'User1' },
    ]);
    vi.mocked(useFetchAvatars).mockReturnValue(true);

    render(<Timeline />, { wrapper });

    const popup = screen.getByText('Posted').closest('div');
    fireEvent.click(popup!);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(mockSetPopUpAvatars).toHaveBeenCalledWith([]);
    expect(mockSetNewTweets).toHaveBeenCalledWith([]);
    expect(mockSetFetchAvatars).toHaveBeenCalledWith(false);
  });

  it('should use Following query key when tab is Following', () => {
    vi.mocked(useSelectedTab).mockReturnValue('Following');
    vi.mocked(usePopUpAvatars).mockReturnValue([
      { avatar: 'avatar1.jpg', name: 'User1' },
    ]);
    vi.mocked(useFetchAvatars).mockReturnValue(true);

    render(<Timeline />, { wrapper });

    const popup = screen.getByText('Posted').closest('div');
    fireEvent.click(popup!);

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should handle intersection observer callback when intersecting', () => {
    render(<Timeline />, { wrapper });

    act(() => {
      intersectionCallback([
        { isIntersecting: true } as IntersectionObserverEntry,
      ]);
    });

    expect(mockSetPopUpAvatars).toHaveBeenCalledWith([]);
    expect(mockSetFetchAvatars).toHaveBeenCalledWith(false);
    expect(mockSetNewTweets).toHaveBeenCalledWith([]);
  });

  it('should handle intersection observer callback when not intersecting', () => {
    render(<Timeline />, { wrapper });

    act(() => {
      intersectionCallback([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]);
    });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockSetFetchAvatars).toHaveBeenCalledWith(true);
  });

  it('should clear interval when intersecting after timeout started', () => {
    render(<Timeline />, { wrapper });

    act(() => {
      intersectionCallback([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]);
    });

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    act(() => {
      intersectionCallback([
        { isIntersecting: true } as IntersectionObserverEntry,
      ]);
    });

    expect(mockSetPopUpAvatars).toHaveBeenCalledWith([]);
  });

  it('should process data from useAvatarsPopUp with posts', () => {
    const mockData = {
      pages: [
        {
          data: {
            posts: [
              { isRepost: false, avatar: 'user1.jpg', name: 'User1' },
              { isRepost: false, avatar: 'user2.jpg', name: 'User2' },
              { isRepost: false, avatar: 'user3.jpg', name: 'User3' },
              { isRepost: false, avatar: 'user4.jpg', name: 'User4' },
            ],
          },
        },
      ],
    };
    vi.mocked(useAvatarsPopUp).mockReturnValue({
      data: mockData,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useAvatarsPopUp>);

    render(<Timeline />, { wrapper });

    expect(mockSetPopUpAvatars).toHaveBeenCalled();
    expect(mockSetNewTweets).toHaveBeenCalled();
  });

  it('should process repost data correctly', () => {
    const mockData = {
      pages: [
        {
          data: {
            posts: [
              {
                isRepost: true,
                originalPostData: { avatar: 'original.jpg', name: 'Original' },
                avatar: 'reposter.jpg',
                name: 'Reposter',
              },
            ],
          },
        },
      ],
    };
    vi.mocked(useAvatarsPopUp).mockReturnValue({
      data: mockData,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useAvatarsPopUp>);

    render(<Timeline />, { wrapper });

    expect(mockSetPopUpAvatars).toHaveBeenCalled();
  });

  it('should handle repost without originalPostData', () => {
    const mockData = {
      pages: [
        {
          data: {
            posts: [
              {
                isRepost: true,
                originalPostData: null,
                avatar: 'reposter.jpg',
                name: 'Reposter',
              },
            ],
          },
        },
      ],
    };
    vi.mocked(useAvatarsPopUp).mockReturnValue({
      data: mockData,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useAvatarsPopUp>);

    render(<Timeline />, { wrapper });

    expect(mockSetPopUpAvatars).toHaveBeenCalled();
  });

  it('should handle less than 3 posts', () => {
    const mockData = {
      pages: [
        {
          data: {
            posts: [{ isRepost: false, avatar: 'user1.jpg', name: 'User1' }],
          },
        },
      ],
    };
    vi.mocked(useAvatarsPopUp).mockReturnValue({
      data: mockData,
      error: null,
      isError: false,
      isLoading: false,
    } as ReturnType<typeof useAvatarsPopUp>);

    render(<Timeline />, { wrapper });

    expect(mockSetPopUpAvatars).toHaveBeenCalled();
  });

  it('should cleanup intersection observer on unmount', () => {
    const { unmount } = render(<Timeline />, { wrapper });

    unmount();

    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('should not set fetch avatars again if interval is already set', () => {
    render(<Timeline />, { wrapper });

    act(() => {
      intersectionCallback([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]);
    });

    act(() => {
      intersectionCallback([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]);
    });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(mockSetFetchAvatars).toHaveBeenCalledTimes(1);
  });
});
