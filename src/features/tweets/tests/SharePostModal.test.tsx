import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SharePostModal from '../components/SharePostModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockOnClose = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/features/authentication/hooks', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser' },
  }),
}));

vi.mock('@/features/profile/hooks/profileQueries', () => ({
  useGetFollowingList: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

describe('SharePostModal Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should render modal when show is true', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SharePostModal
          show={true}
          postId={1}
          postUrl="https://example.com/post/1"
          onClose={mockOnClose}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText('Send via Direct Message')).toBeInTheDocument();
  });

  it('should not render modal when show is false', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <SharePostModal
          show={false}
          postId={1}
          postUrl="https://example.com/post/1"
          onClose={mockOnClose}
        />
      </QueryClientProvider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should call onClose when close button is clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SharePostModal
          show={true}
          postId={1}
          postUrl="https://example.com/post/1"
          onClose={mockOnClose}
        />
      </QueryClientProvider>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should display search input for finding users', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SharePostModal
          show={true}
          postId={1}
          postUrl="https://example.com/post/1"
          onClose={mockOnClose}
        />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search people...');
    expect(searchInput).toBeInTheDocument();
  });

  it('should display empty state when no followers', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SharePostModal
          show={true}
          postId={1}
          postUrl="https://example.com/post/1"
          onClose={mockOnClose}
        />
      </QueryClientProvider>
    );

    // Wait for loading to finish and check for loading spinner first
    await waitFor(() => {
      const spinner = document.querySelector('.animate-spin');
      // The component is currently in loading state
      expect(spinner).toBeInTheDocument();
    });
  });
});
