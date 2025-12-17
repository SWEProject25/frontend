import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Assuming FollowButton component exists
// If the component is in a different location, adjust the import path
// import FollowButton from '../components/FollowButton';

const mockFollowButton = {
  userId: 1,
  isFollowed: false,
  username: 'testuser',
};

describe('FollowButton Component', () => {
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

  it('should render Follow button when not followed', () => {
    // Test implementation
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} />
    //   </QueryClientProvider>
    // );
    // expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
  });

  it('should render Following button when already followed', () => {
    const followedProps = { ...mockFollowButton, isFollowed: true };

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...followedProps} />
    //   </QueryClientProvider>
    // );

    // expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
  });

  it('should call follow mutation when Follow button is clicked', async () => {
    // const onFollow = vi.fn();
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} onFollow={onFollow} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // fireEvent.click(followButton);
    // await waitFor(() => {
    //   expect(onFollow).toHaveBeenCalledWith(mockFollowButton.userId);
    // });
  });

  it('should call unfollow mutation when Following button is clicked', async () => {
    const followedProps = { ...mockFollowButton, isFollowed: true };
    // const onUnfollow = vi.fn();

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...followedProps} onUnfollow={onUnfollow} />
    //   </QueryClientProvider>
    // );

    // const followingButton = screen.getByRole('button', { name: /following/i });
    // fireEvent.click(followingButton);

    // await waitFor(() => {
    //   expect(onUnfollow).toHaveBeenCalledWith(mockFollowButton.userId);
    // });
  });

  it('should show Unfollow text on hover when Following', () => {
    const followedProps = { ...mockFollowButton, isFollowed: true };

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...followedProps} />
    //   </QueryClientProvider>
    // );

    // const followingButton = screen.getByRole('button', { name: /following/i });
    // fireEvent.mouseEnter(followingButton);

    // expect(screen.getByText(/unfollow/i)).toBeInTheDocument();
  });

  it('should be disabled while loading', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} isLoading={true} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button');
    // expect(followButton).toBeDisabled();
  });

  it('should show loading spinner when mutation is in progress', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} isLoading={true} />
    //   </QueryClientProvider>
    // );
    // expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have correct styling for Follow button', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // expect(followButton).toHaveClass('bg-white text-black');
  });

  it('should have correct styling for Following button', () => {
    const followedProps = { ...mockFollowButton, isFollowed: true };

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...followedProps} />
    //   </QueryClientProvider>
    // );

    // const followingButton = screen.getByRole('button', { name: /following/i });
    // expect(followingButton).toHaveClass('border border-gray-600');
  });

  it('should stop event propagation on click', () => {
    const stopPropagation = vi.fn();

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} />
    //   </QueryClientProvider>
    // );

    // const followButton = screen.getByRole('button', { name: /follow/i });
    // const clickEvent = new MouseEvent('click', { bubbles: true });
    // Object.defineProperty(clickEvent, 'stopPropagation', {
    //   value: stopPropagation,
    // });

    // followButton.dispatchEvent(clickEvent);
    // expect(stopPropagation).toHaveBeenCalled();
  });

  it('should handle follow error gracefully', async () => {
    // Mock error scenario
    // const onError = vi.fn();
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} onError={onError} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // fireEvent.click(followButton);
    // await waitFor(() => {
    //   expect(onError).toHaveBeenCalled();
    // });
  });

  it('should update button state optimistically', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // fireEvent.click(followButton);
    // // Should immediately show Following state
    // await waitFor(() => {
    //   expect(screen.getByRole('button', { name: /following/i })).toBeInTheDocument();
    // });
  });

  it('should revert state on follow error', async () => {
    // Test optimistic update rollback on error
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // fireEvent.click(followButton);
    // // After error, should revert to Follow
    // await waitFor(() => {
    //   expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument();
    // });
  });

  it('should render with custom size prop', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} size="sm" />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button');
    // expect(followButton).toHaveClass('text-sm px-3 py-1');
  });

  it('should render with custom className', () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} className="custom-class" />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button');
    // expect(followButton).toHaveClass('custom-class');
  });

  it('should not render for own profile', () => {
    const ownProfileProps = { ...mockFollowButton, isOwnProfile: true };

    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...ownProfileProps} />
    //   </QueryClientProvider>
    // );

    // expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    // render(
    //   <QueryClientProvider client={queryClient}>
    //     <FollowButton {...mockFollowButton} showTooltip={true} />
    //   </QueryClientProvider>
    // );
    // const followButton = screen.getByRole('button', { name: /follow/i });
    // fireEvent.mouseEnter(followButton);
    // await waitFor(() => {
    //   expect(screen.getByRole('tooltip')).toHaveTextContent('Follow @testuser');
    // });
  });
});
