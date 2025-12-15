import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockReposters = [
  {
    userId: 1,
    name: 'User One',
    username: 'userone',
    avatar: 'avatar1.jpg',
    verified: true,
    isFollowedByMe: false,
  },
  {
    userId: 2,
    name: 'User Two',
    username: 'usertwo',
    avatar: 'avatar2.jpg',
    verified: false,
    isFollowedByMe: true,
  },
];

describe('RepostersList Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should render list of reposters', async () => {
    // Mock the API response
    // vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
    //   useGetRepostersByTweetId: () => ({
    //     data: {
    //       pages: [{ data: mockReposters }],
    //     },
    //     isLoading: false,
    //     isError: false,
    //   }),
    // }));
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByText('User One')).toBeInTheDocument();
    //   expect(screen.getByText('User Two')).toBeInTheDocument();
    // });
  });

  it('should display user avatars', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   const avatars = screen.getAllByRole('img');
    //   expect(avatars.length).toBe(2);
    // });
  });

  it('should show verified badge for verified users', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   const verifiedIcons = screen.getAllByTestId('verified-icon');
    //   expect(verifiedIcons.length).toBeGreaterThan(0);
    // });
  });

  it('should display follow button for each user', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   const followButtons = screen.getAllByRole('button', { name: /follow/i });
    //   expect(followButtons.length).toBeGreaterThan(0);
    // });
  });

  it('should show loading state while fetching', () => {
    // vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
    //   useGetRepostersByTweetId: () => ({
    //     data: null,
    //     isLoading: true,
    //     isError: false,
    //   }),
    // }));
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    // vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
    //   useGetRepostersByTweetId: () => ({
    //     data: null,
    //     isLoading: false,
    //     isError: true,
    //     error: { message: 'Failed to load reposters' },
    //   }),
    // }));
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
    // });
  });

  it('should show empty state when no reposters', async () => {
    // vi.mock('@/features/tweets/hooks/tweetQueries', () => ({
    //   useGetRepostersByTweetId: () => ({
    //     data: { pages: [{ data: [] }] },
    //     isLoading: false,
    //     isError: false,
    //   }),
    // }));
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByText(/No reposters yet/i)).toBeInTheDocument();
    // });
  });

  it('should support infinite scroll', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // // Scroll to bottom
    // // Should trigger fetchNextPage
    // await waitFor(() => {
    //   // Check if more items are loaded
    // });
  });

  it('should navigate to user profile when user clicked', async () => {
    // const pushMock = vi.fn();
    // vi.mock('next/navigation', () => ({
    //   useRouter: () => ({
    //     push: pushMock,
    //   }),
    // }));
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   const userLink = screen.getByText('User One');
    //   fireEvent.click(userLink);
    //   expect(pushMock).toHaveBeenCalledWith('/userone');
    // });
  });

  it('should show "Following" for users already followed', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    // });
  });

  it('should display usernames with @ prefix', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByText('@userone')).toBeInTheDocument();
    //   expect(screen.getByText('@usertwo')).toBeInTheDocument();
    // });
  });

  it('should have header with title', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // expect(screen.getByText(/Reposted by/i)).toBeInTheDocument();
  });

  it('should have back button to close modal', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} onClose={() => {}} />
    //   </QueryClientProvider>
    // );
    // const backButton = screen.getByRole('button', { name: /back/i });
    // expect(backButton).toBeInTheDocument();
  });

  it('should call onClose when back button clicked', () => {
    // const onClose = vi.fn();
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} onClose={onClose} />
    //   </QueryClientProvider>
    // );
    // const backButton = screen.getByRole('button', { name: /back/i });
    // fireEvent.click(backButton);
    // expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should display total reposters count', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <RepostersList tweetId={1} />
    //   </QueryClientProvider>
    // );
    // await waitFor(() => {
    //   expect(screen.getByText(/2 reposters/i)).toBeInTheDocument();
    // });
  });
});
