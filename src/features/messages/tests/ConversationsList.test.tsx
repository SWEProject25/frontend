import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ConversationsList from '../components/ConversationsList';

describe('ConversationsList', () => {
  const mockProps = {
    selectedConversation: null,
    onSelectConversation: vi.fn(),
  };

  it('should render conversations header', () => {
    render(<ConversationsList {...mockProps} />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    render(<ConversationsList {...mockProps} />);
    const loading = screen.queryByText(/loading/i);
    expect(loading).toBeTruthy();
  });
});
