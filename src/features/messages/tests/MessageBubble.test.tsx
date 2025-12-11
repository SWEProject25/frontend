import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MessageBubble from '../components/MessageItem/MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = {
    id: 1,
    senderId: 1,
    conversationId: 1,
    text: 'Hello there!',
    isSeen: false,
    createdAt: '2024-01-15T10:30:00Z',
  };

  it('should render message text', () => {
    render(<MessageBubble message={mockMessage} isCurrentUser={false} />);
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('should apply blue background for current user messages', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isCurrentUser={true} />
    );
    const bubble = container.querySelector('.bg-blue-500');
    expect(bubble).toBeInTheDocument();
  });

  it('should apply gray background for other user messages', () => {
    const { container } = render(
      <MessageBubble message={mockMessage} isCurrentUser={false} />
    );
    const bubble = container.querySelector('.bg-gray-800');
    expect(bubble).toBeInTheDocument();
  });

  it('should display formatted timestamp', () => {
    render(<MessageBubble message={mockMessage} isCurrentUser={false} />);
    // Check if time element exists (format depends on locale)
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('should show seen status for current user messages', () => {
    const seenMessage = { ...mockMessage, isSeen: true };
    render(<MessageBubble message={seenMessage} isCurrentUser={true} />);
    expect(screen.getByText('Seen')).toBeInTheDocument();
  });

  it('should not show seen status for other user messages', () => {
    const seenMessage = { ...mockMessage, isSeen: true };
    render(<MessageBubble message={seenMessage} isCurrentUser={false} />);
    expect(screen.queryByText('Seen')).not.toBeInTheDocument();
  });
});
