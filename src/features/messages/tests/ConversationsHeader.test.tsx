import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConversationsHeader from '../components/conversationlist/ConversationsHeader';

describe('ConversationsHeader', () => {
  it('should render Messages heading', () => {
    render(<ConversationsHeader unseenConversationsCount={0} />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('should not show badge when no unseen conversations', () => {
    const { container } = render(
      <ConversationsHeader unseenConversationsCount={0} />
    );
    const badge = container.querySelector('.bg-blue-500');
    expect(badge).not.toBeInTheDocument();
  });

  it('should show unseen count when there are unseen conversations', () => {
    render(<ConversationsHeader unseenConversationsCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
