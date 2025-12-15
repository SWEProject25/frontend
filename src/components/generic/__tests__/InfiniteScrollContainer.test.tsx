import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import InfiniteScrollContainer from '../InfiniteScrollContainer';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('InfiniteScrollContainer Component', () => {
  const mockOnLoadMore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      >
        <div data-testid="child-content">Child Content</div>
      </InfiniteScrollContainer>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should show loader when loading', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={true}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show custom loader when provided', () => {
    const customLoader = <div data-testid="custom-loader">Loading...</div>;

    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={true}
        loader={customLoader}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
  });

  it('should show "no more items" message when hasMore is false and not loading', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={false}
        isLoading={false}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(screen.getByText('No more items to load')).toBeInTheDocument();
  });

  it('should not show "no more items" message when hasMore is true', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(screen.queryByText('No more items to load')).not.toBeInTheDocument();
  });

  it('should create IntersectionObserver with correct options', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
        threshold={200}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        root: null,
        rootMargin: '200px',
        threshold: 0,
      })
    );
  });

  it('should use default threshold of 100 when not provided', () => {
    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '100px',
      })
    );
  });

  it('should call observe on the target element', () => {
    const mockObserve = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });

    render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    expect(mockObserve).toHaveBeenCalled();
  });

  it('should cleanup observer on unmount', () => {
    const mockUnobserve = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: mockUnobserve,
      disconnect: vi.fn(),
    });

    const { unmount } = render(
      <InfiniteScrollContainer
        onLoadMore={mockOnLoadMore}
        hasMore={true}
        isLoading={false}
      >
        <div>Content</div>
      </InfiniteScrollContainer>
    );

    unmount();

    expect(mockUnobserve).toHaveBeenCalled();
  });
});
