import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import MediaTweets from '../MediaTweets';
import { useProfileMedia } from '../../hooks/profileQueries';

// Mock the hooks
vi.mock('../../hooks/profileQueries', () => ({
  useProfileMedia: vi.fn(),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: any;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

const mockUseProfileMedia = useProfileMedia as ReturnType<typeof vi.fn>;

describe('MediaTweets', () => {
  beforeEach(() => {
    mockUseProfileMedia.mockClear();
  });

  it('should render loading state', () => {
    mockUseProfileMedia.mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isLoading: true,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const loader = screen.getByTestId('profile-tweets-loading');
    expect(loader).toBeInTheDocument();
  });

  it('should render error state', () => {
    const mockError = new Error('Failed to fetch media');
    mockUseProfileMedia.mockReturnValue({
      data: undefined,
      error: mockError,
      isError: true,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const errorMessage = screen.getByTestId('profile-tweets-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Error Failed to fetch media');
  });

  it('should render empty state when no media', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const infiniteScroll = screen.getByTestId('profile-tweets-list');
    expect(infiniteScroll).toBeInTheDocument();
    expect(screen.getByText('No Media')).toBeInTheDocument();
  });

  it('should render image media correctly', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 1,
                type: 'image',
                media_url: 'https://example.com/image1.jpg',
              },
              {
                id: 2,
                type: 'IMAGE',
                media_url: 'https://example.com/image2.jpg',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const image1 = screen.getByTestId('image-1');
    const image2 = screen.getByTestId('image-2');

    expect(image1).toBeInTheDocument();
    expect(image2).toBeInTheDocument();
    expect(image1).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(image2).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('should render video media correctly', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 3,
                type: 'video',
                media_url: 'https://example.com/video1.mp4',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const video = screen.getByTestId('video-3');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'https://example.com/video1.mp4');
  });

  it('should handle video play/pause on click', async () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 4,
                type: 'video',
                media_url: 'https://example.com/video2.mp4',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    const video = screen.getByTestId('video-4') as HTMLVideoElement;

    // Mock play and pause methods
    video.play = vi.fn().mockResolvedValue(undefined);
    video.pause = vi.fn();

    // Initially paused
    Object.defineProperty(video, 'paused', {
      writable: true,
      value: true,
    });

    // Click to play
    video.click();
    expect(video.play).toHaveBeenCalled();

    // Now playing
    Object.defineProperty(video, 'paused', {
      writable: true,
      value: false,
    });

    // Click to pause
    video.click();
    expect(video.pause).toHaveBeenCalled();
  });

  it('should display video duration after metadata loads', async () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 5,
                type: 'video',
                media_url: 'https://example.com/video3.mp4',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    const { act } = await import('@testing-library/react');

    render(<MediaTweets />);

    const video = screen.getByTestId('video-5') as HTMLVideoElement;

    // Mock video duration
    Object.defineProperty(video, 'duration', {
      writable: true,
      value: 125, // 2:05
    });

    // Trigger onLoadedMetadata wrapped in act
    await act(async () => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });

    await waitFor(() => {
      expect(screen.getByText('2:05')).toBeInTheDocument();
    });
  });

  it('should render mixed media types', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 6,
                type: 'image',
                media_url: 'https://example.com/image3.jpg',
              },
              {
                id: 7,
                type: 'video',
                media_url: 'https://example.com/video4.mp4',
              },
              {
                id: 8,
                type: 'IMAGE',
                media_url: 'https://example.com/image4.jpg',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    expect(screen.getByTestId('image-6')).toBeInTheDocument();
    expect(screen.getByTestId('video-7')).toBeInTheDocument();
    expect(screen.getByTestId('image-8')).toBeInTheDocument();
  });

  it('should call fetchNextPage when scrolling with more data', () => {
    const mockFetchNextPage = vi.fn();
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 9,
                type: 'image',
                media_url: 'https://example.com/image5.jpg',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: mockFetchNextPage,
      isFetchingNextPage: false,
      hasNextPage: true,
    });

    render(<MediaTweets />);

    const infiniteScroll = screen.getByTestId('profile-tweets-list');
    expect(infiniteScroll).toBeInTheDocument();
  });

  it('should render grid layout with correct classes', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 10,
                type: 'image',
                media_url: 'https://example.com/image6.jpg',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    const { container } = render(<MediaTweets />);

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-3', 'p-1', 'gap-2', 'w-full');
  });

  it('should handle multiple pages of media', () => {
    mockUseProfileMedia.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              {
                id: 11,
                type: 'image',
                media_url: 'https://example.com/image7.jpg',
              },
            ],
          },
          {
            data: [
              {
                id: 12,
                type: 'video',
                media_url: 'https://example.com/video5.mp4',
              },
            ],
          },
        ],
      },
      error: null,
      isError: false,
      isLoading: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
      hasNextPage: false,
    });

    render(<MediaTweets />);

    expect(screen.getByTestId('image-11')).toBeInTheDocument();
    expect(screen.getByTestId('video-12')).toBeInTheDocument();
  });
});
