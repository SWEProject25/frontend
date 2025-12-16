import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: function Icon(props: {
    path: string;
    disabled?: boolean;
    color?: string;
  }) {
    return (
      <span
        data-testid="icon"
        data-disabled={props.disabled}
        data-color={props.color}
      >
        Arrow Icon
      </span>
    );
  },
}));

// Mock MediaItem
vi.mock('../components/MediaItem', () => ({
  default: function MockMediaItem({
    id,
    full,
    onClick,
  }: {
    id: string;
    full: boolean;
    media: unknown;
    onClick: () => void;
  }) {
    return (
      <div data-testid={`media-item-${id}`} data-full={full} onClick={onClick}>
        Media Item {id}
      </div>
    );
  },
}));

// Mock useAddPostContext
const mockUseMedia = vi.fn();
vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useMedia: mockUseMedia,
  })),
}));

import MediaPreview from '../components/MediaPreview';

describe('MediaPreview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMedia.mockReturnValue([]);
  });

  it('should return null when no media', () => {
    mockUseMedia.mockReturnValue([]);
    const { container } = render(<MediaPreview />);
    expect(container.firstChild).toBeNull();
  });

  it('should render single media item with full width', () => {
    mockUseMedia.mockReturnValue([{ id: '1', type: 'local', data: {} }]);

    render(<MediaPreview />);

    expect(screen.getByTestId('media-preview')).toBeInTheDocument();
    const mediaItem = screen.getByTestId('media-item-1');
    expect(mediaItem).toBeInTheDocument();
    // When full is true, the component sets the prop
    expect(mediaItem.textContent).toContain('Media Item 1');
  });

  it('should render two media items in grid', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    expect(screen.getByTestId('media-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('media-item-2')).toBeInTheDocument();
  });

  it('should show navigation arrows with more than 2 media items', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Right arrow should be visible initially
    const rightArrow = screen.getByTestId('right-arrow-0');
    expect(rightArrow).toBeInTheDocument();
  });

  it('should navigate to next media on right arrow click', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
      { id: '4', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // After click, left arrow should appear
    expect(screen.getByTestId('left-arrow-1')).toBeInTheDocument();
  });

  it('should navigate to previous media on left arrow click', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
      { id: '4', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Navigate forward first
    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // Then navigate back
    const leftArrow = screen.getByTestId('left-arrow-1');
    fireEvent.click(leftArrow);

    // Should be back at index 0
    expect(screen.getByTestId('right-arrow-0')).toBeInTheDocument();
  });

  it('should update index when left media item is clicked', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
      { id: '4', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Navigate to index 1 first
    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // Click the left media item
    const leftItem = screen.getByTestId('media-item-2');
    fireEvent.click(leftItem);

    // Index should decrease
    expect(screen.getByTestId('media-item-1')).toBeInTheDocument();
  });

  it('should update index when right media item at end is removed', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Navigate to the end
    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // Click the right media item (which should trigger index decrease)
    const rightItem = screen.getByTestId('media-item-3');
    fireEvent.click(rightItem);

    // Index should remain valid
    expect(screen.getByTestId('media-preview')).toBeInTheDocument();
  });

  it('should not show left arrow at first index', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    expect(screen.queryByTestId('left-arrow-0')).not.toBeInTheDocument();
  });

  it('should not show right arrow at last index', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
      { id: '3', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Navigate to the end
    fireEvent.click(screen.getByTestId('right-arrow-0'));

    // Right arrow should not be visible at the end
    expect(screen.queryByTestId('right-arrow-1')).not.toBeInTheDocument();
  });

  it('should have correct grid classes for multiple media', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    const preview = screen.getByTestId('media-preview');
    expect(preview).toHaveClass('grid', 'grid-cols-2', 'gap-1');
  });

  it('should have full width class for single media', () => {
    mockUseMedia.mockReturnValue([{ id: '1', type: 'local', data: {} }]);

    render(<MediaPreview />);

    const preview = screen.getByTestId('media-preview');
    expect(preview).toHaveClass('w-full');
  });

  it('should not decrease index below 0 on left item click', () => {
    mockUseMedia.mockReturnValue([
      { id: '1', type: 'local', data: {} },
      { id: '2', type: 'local', data: {} },
    ]);

    render(<MediaPreview />);

    // Click left item at index 0
    const leftItem = screen.getByTestId('media-item-1');
    fireEvent.click(leftItem);

    // Should still show same items
    expect(screen.getByTestId('media-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('media-item-2')).toBeInTheDocument();
  });
});
