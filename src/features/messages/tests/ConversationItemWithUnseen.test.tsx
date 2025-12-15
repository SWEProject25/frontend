import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConversationItemWithUnseen from '../components/ConversationItemWithUnseen';
import { useMessageStore } from '../store/useMessageStore';

// Mock the hooks
vi.mock('../hooks/useUnseenCounts', () => ({
  useConversationUnseenCount: vi.fn(),
}));

vi.mock('../store/useMessageStore', () => ({
  useMessageStore: vi.fn(),
}));

import { useConversationUnseenCount } from '../hooks/useUnseenCounts';

describe('ConversationItemWithUnseen', () => {
  let queryClient: QueryClient;
  const mockUpdateConversationUnseenCount = vi.fn();

  const defaultProps = {
    id: 1,
    avatar: 'https://example.com/avatar.jpg',
    name: 'John Doe',
    username: 'johndoe',
    isVerified: true,
    lastMessageText: 'Hello there!',
    timestamp: '2m',
    isSelected: false,
    isTyping: false,
    unseenCount: 3,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.clearAllMocks();

    // Default mock implementation
    (useMessageStore as any).mockImplementation((selector: any) => {
      const state = {
        updateConversationUnseenCount: mockUpdateConversationUnseenCount,
        unseenCounts: { 1: 3 },
      };
      return selector(state);
    });

    (useConversationUnseenCount as any).mockReturnValue({
      data: undefined,
      isLoading: false,
    });
  });

  const renderWithProvider = (props = defaultProps) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ConversationItemWithUnseen {...props} />
      </QueryClientProvider>
    );
  };

  it('should render conversation item with correct props', () => {
    renderWithProvider();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
    expect(screen.getByText('2m')).toBeInTheDocument();
  });

  it('should display unseen count from store', () => {
    renderWithProvider();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should use initial unseen count when store value is undefined', () => {
    (useMessageStore as any).mockImplementation((selector: any) => {
      const state = {
        updateConversationUnseenCount: mockUpdateConversationUnseenCount,
        unseenCounts: {},
      };
      return selector(state);
    });

    renderWithProvider();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should update store when API returns unseen count', async () => {
    (useConversationUnseenCount as any).mockReturnValue({
      data: 5,
      isLoading: false,
    });

    renderWithProvider();

    await waitFor(() => {
      expect(mockUpdateConversationUnseenCount).toHaveBeenCalledWith(1, 5);
    });
  });

  it('should not update store when API returns undefined', () => {
    (useConversationUnseenCount as any).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderWithProvider();

    expect(mockUpdateConversationUnseenCount).not.toHaveBeenCalled();
  });

  it('should fetch unseen count on mount', () => {
    renderWithProvider();

    expect(useConversationUnseenCount).toHaveBeenCalledWith(1, true);
  });

  it('should show verified badge for verified users', () => {
    const { container } = renderWithProvider();

    const verifiedSvg = container.querySelector('svg.text-blue-500');
    expect(verifiedSvg).toBeInTheDocument();
  });

  it('should not show verified badge for non-verified users', () => {
    const { container } = renderWithProvider({
      ...defaultProps,
      isVerified: false,
    });

    const verifiedSvg = container.querySelector('svg.text-blue-500');
    expect(verifiedSvg).not.toBeInTheDocument();
  });

  it('should show typing indicator when isTyping is true', () => {
    renderWithProvider({ ...defaultProps, isTyping: true });

    expect(screen.getByText('typing...')).toBeInTheDocument();
  });

  it('should highlight conversation when selected', () => {
    const { container } = renderWithProvider({
      ...defaultProps,
      isSelected: true,
    });

    const conversationItem = container.querySelector('.bg-gray-900');
    expect(conversationItem).toBeInTheDocument();
  });

  it('should call onClick when conversation is clicked', () => {
    const onClick = vi.fn();
    renderWithProvider({ ...defaultProps, onClick });

    const conversationItem = screen
      .getByText('John Doe')
      .closest('div')?.parentElement;
    conversationItem?.click();

    expect(onClick).toHaveBeenCalled();
  });

  it('should update unseen count when API data changes', async () => {
    const { rerender } = renderWithProvider();

    // Update API data
    (useConversationUnseenCount as any).mockReturnValue({
      data: 7,
      isLoading: false,
    });

    rerender(
      <QueryClientProvider client={queryClient}>
        <ConversationItemWithUnseen {...defaultProps} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(mockUpdateConversationUnseenCount).toHaveBeenCalledWith(1, 7);
    });
  });
});
