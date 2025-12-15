import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MediaPreview from '@/features/media/components/MediaPreview';

const mockMediaList = [
  { id: '1', type: 'uploadedImage' as const, data: 'image1.jpg' },
  { id: '2', type: 'uploadedImage' as const, data: 'image2.jpg' },
  { id: '3', type: 'uploadedImage' as const, data: 'image3.jpg' },
];

const mockSingleMedia = [
  { id: '1', type: 'uploadedImage' as const, data: 'image1.jpg' },
];

const mockEmptyMedia: any[] = [];

let mockMediaState = mockMediaList;

beforeEach(() => {
  vi.clearAllMocks();
  mockMediaState = mockMediaList;
});

vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: () => ({
    useMedia: () => mockMediaState,
    useActions: () => ({
      removeMedia: vi.fn(),
    }),
  }),
}));

describe('MediaPreview Component', () => {
  it('should render media preview with images', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    const preview = screen.getByTestId('media-preview');
    expect(preview).toBeInTheDocument();
  });

  it('should not render when no media', () => {
    mockMediaState = mockEmptyMedia;
    const { container } = render(<MediaPreview />);
    expect(container.firstChild).toBeNull();
  });

  it('should render single image in full width', () => {
    mockMediaState = mockSingleMedia;
    render(<MediaPreview />);

    const preview = screen.getByTestId('media-preview');
    expect(preview).toHaveClass('w-full');
  });

  it('should render multiple images in grid', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    const preview = screen.getByTestId('media-preview');
    expect(preview.className).toContain('grid');
  });

  it('should show left arrow when not at first image', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    // Initially at index 0, left arrow should not be visible
    expect(screen.queryByTestId('left-arrow-0')).not.toBeInTheDocument();
  });

  it('should show right arrow when more images exist', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    // Should show right arrow when there are more than 2 images and currentIndex < length - 2
    const rightArrow = screen.queryByTestId('right-arrow-0');
    expect(rightArrow).toBeInTheDocument();
  });

  it('should navigate to next image when right arrow clicked', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // After clicking, should be at index 1, so left arrow should appear
    expect(screen.getByTestId('left-arrow-1')).toBeInTheDocument();
  });

  it('should navigate to previous image when left arrow clicked', () => {
    mockMediaState = mockMediaList;
    render(<MediaPreview />);

    // First navigate to index 1
    const rightArrow = screen.getByTestId('right-arrow-0');
    fireEvent.click(rightArrow);

    // Then click left arrow to go back to index 0
    const leftArrow = screen.getByTestId('left-arrow-1');
    fireEvent.click(leftArrow);

    // Should be back at index 0, so left arrow should not be visible
    expect(screen.queryByTestId('left-arrow-0')).not.toBeInTheDocument();
  });
});
