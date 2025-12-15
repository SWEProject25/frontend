import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageModal from '../ImageModal';

vi.mock('next/image', () => {
  // Mock a functional component named Image to match Next.js API
  // and avoid the ESLint warning for <img>
  // Accepts all props and renders a div for test purposes
  // but with data-testid for assertions
  return {
    __esModule: true,
    default: function Image(props: any) {
      return <div data-testid="modal-image" {...props} />;
    },
  };
});

vi.mock('@/components/ui/home/Icon', () => ({
  default: ({ onClick, path }: { onClick?: () => void; path: string }) => (
    <div onClick={onClick} data-testid={`icon-${path.substring(0, 10)}`}>
      Icon
    </div>
  ),
}));

describe('ImageModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  const mockMedia = [
    { url: 'https://example.com/image1.jpg', type: 'image' as const },
    { url: 'https://example.com/image2.jpg', type: 'image' as const },
    { url: 'https://example.com/image3.jpg', type: 'image' as const },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ImageModal
        isOpen={false}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
      />
    );

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
  });

  it('should not render when media array is empty', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={[]}
        currentIndex={0}
      />
    );

    expect(screen.queryByTestId('image-modal')).not.toBeInTheDocument();
  });

  it('should render modal when isOpen is true and media exists', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
      />
    );

    expect(screen.getByTestId('image-modal')).toBeInTheDocument();
  });

  it('should render close button', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
      />
    );

    expect(screen.getByTestId('image-modal-close-btn')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
      />
    );

    fireEvent.click(screen.getByTestId('image-modal-close-btn'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when backdrop is clicked', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
      />
    );

    fireEvent.click(screen.getByTestId('image-modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display current image', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
      />
    );

    const image = screen.getByTestId('modal-image');
    expect(image).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('should show navigation buttons when showNavigation is true and has multiple media', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
        showNavigation={true}
      />
    );

    expect(screen.getByTestId('image-modal-prev-btn')).toBeInTheDocument();
    expect(screen.getByTestId('image-modal-next-btn')).toBeInTheDocument();
  });

  it('should not show navigation buttons when showNavigation is false', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
        showNavigation={false}
      />
    );

    expect(
      screen.queryByTestId('image-modal-prev-btn')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('image-modal-next-btn')
    ).not.toBeInTheDocument();
  });

  it('should call onNext when next button is clicked', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={0}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    fireEvent.click(screen.getByTestId('image-modal-next-btn'));
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('should call onPrev when prev button is clicked', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    fireEvent.click(screen.getByTestId('image-modal-prev-btn'));
    expect(mockOnPrev).toHaveBeenCalled();
  });

  it('should show counter when showCounter is true', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
        showCounter={true}
      />
    );

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('should not show counter when showCounter is false', () => {
    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        currentIndex={1}
        showCounter={false}
      />
    );

    expect(screen.queryByText('2 / 3')).not.toBeInTheDocument();
  });

  it('should not show navigation for single media item', () => {
    const singleMedia = [
      { url: 'https://example.com/image1.jpg', type: 'image' as const },
    ];

    render(
      <ImageModal
        isOpen={true}
        onClose={mockOnClose}
        media={singleMedia}
        currentIndex={0}
        onNext={mockOnNext}
        onPrev={mockOnPrev}
      />
    );

    expect(
      screen.queryByTestId('image-modal-prev-btn')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('image-modal-next-btn')
    ).not.toBeInTheDocument();
  });
});
