import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock next/image
vi.mock('next/image', () => ({
  default: function MockImage(props: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
    priority?: boolean;
    'data-testid'?: string;
    width?: number;
    height?: number;
  }) {
    return (
      <div
        data-testid={props['data-testid'] || 'next-image'}
        data-src={typeof props.src === 'string' ? props.src : 'mock-url'}
        data-alt={props.alt}
        className={props.className}
        data-fill={props.fill}
        data-sizes={props.sizes}
        data-priority={props.priority}
      />
    );
  },
}));

// Mock useAddPostContext
const mockRemoveMedia = vi.fn();
vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useActions: () => ({
      removeMedia: mockRemoveMedia,
    }),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: function Icon() {
    return <div data-testid="icon">Icon</div>;
  },
}));

// Mock Video component
vi.mock('../components/Video', () => ({
  default: function MockVideo({ id, video }: { id: string; video: File }) {
    return (
      <div data-testid={`video-${id}`} data-filename={video.name}>
        Video Player
      </div>
    );
  },
}));

import MediaItem from '../components/MediaItem';
import { EXTERNAL_GIF, LOCAL_MEDIA } from '../constants/mediaConstants';

describe('MediaItem Component', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render local image media', () => {
    const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const media = {
      id: '1',
      type: LOCAL_MEDIA,
      data: imageFile,
    };

    render(<MediaItem id="1" media={media} onClick={mockOnClick} />);

    expect(screen.getByTestId('image-1')).toBeInTheDocument();
  });

  it('should render external gif media', () => {
    const media = {
      id: '2',
      type: EXTERNAL_GIF,
      data: {
        id: 'gif-1',
        title: 'Test GIF',
        images: {
          original: { url: 'https://example.com/gif.gif' },
        },
      },
    };

    render(<MediaItem id="2" media={media} onClick={mockOnClick} />);

    expect(screen.getByTestId('image-2')).toBeInTheDocument();
    expect(screen.getByTestId('via')).toHaveTextContent('Via');
    expect(screen.getByTestId('giphy')).toHaveTextContent('GIPHY');
  });

  it('should render local gif media with GIF label', () => {
    const gifFile = new File(['test'], 'test.gif', { type: 'image/gif' });
    const media = {
      id: '3',
      type: LOCAL_MEDIA,
      data: gifFile,
    };

    render(<MediaItem id="3" media={media} onClick={mockOnClick} />);

    expect(screen.getByTestId('image-3')).toBeInTheDocument();
    expect(screen.getByText('GIF')).toBeInTheDocument();
  });

  it('should render video media', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const media = {
      id: '4',
      type: LOCAL_MEDIA,
      data: videoFile,
    };

    render(<MediaItem id="4" media={media} onClick={mockOnClick} />);

    expect(screen.getByTestId('video-4')).toBeInTheDocument();
  });

  it('should call onClick and removeMedia when close button is clicked', () => {
    const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const media = {
      id: '5',
      type: LOCAL_MEDIA,
      data: imageFile,
    };

    render(<MediaItem id="5" media={media} onClick={mockOnClick} />);

    const closeButton = screen.getByText('✕');
    closeButton.click();

    expect(mockOnClick).toHaveBeenCalled();
    expect(mockRemoveMedia).toHaveBeenCalledWith('5');
  });

  it('should show GIPHY attribution for external gifs', () => {
    const media = {
      id: '6',
      type: EXTERNAL_GIF,
      data: {
        id: 'gif-2',
        title: 'Another GIF',
        images: {
          original: { url: 'https://example.com/another.gif' },
        },
      },
    };

    render(<MediaItem id="6" media={media} onClick={mockOnClick} />);

    // Check for GIPHY attribution elements
    expect(screen.getByTestId('next-image')).toBeInTheDocument();
    expect(screen.getByTestId('giphy')).toHaveTextContent('GIPHY');
  });

  it('should handle full width layout', () => {
    const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const media = {
      id: '7',
      type: LOCAL_MEDIA,
      data: imageFile,
    };

    const { container } = render(
      <MediaItem id="7" media={media} onClick={mockOnClick} />
    );

    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('should render with correct aspect ratio container', () => {
    const imageFile = new File(['test'], 'test.png', { type: 'image/png' });
    const media = {
      id: '8',
      type: LOCAL_MEDIA,
      data: imageFile,
    };

    const { container } = render(
      <MediaItem id="8" media={media} onClick={mockOnClick} />
    );

    const aspectContainer = container.querySelector('.aspect-square');
    expect(aspectContainer).toBeInTheDocument();
  });
});
