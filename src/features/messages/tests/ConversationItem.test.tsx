import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ConversationItem from '../components/conversationlist/ConversationItem';

describe('ConversationItem', () => {
  const mockProps = {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'avatar.jpg',
    isVerified: false,
    lastMessageText: 'Hey there!',
    timestamp: '2m',
    isSelected: false,
    isTyping: false,
    unseenCount: 2,
    onClick: vi.fn(),
  };

  it('should render conversation name', () => {
    render(<ConversationItem {...mockProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render username with @ symbol', () => {
    render(<ConversationItem {...mockProps} />);
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
  });

  it('should render last message text', () => {
    render(<ConversationItem {...mockProps} />);
    expect(screen.getByText('Hey there!')).toBeInTheDocument();
  });

  it('should show timestamp', () => {
    render(<ConversationItem {...mockProps} />);
    expect(screen.getByText('2m')).toBeInTheDocument();
  });

  it('should show typing indicator when user is typing', () => {
    render(<ConversationItem {...mockProps} isTyping={true} />);
    expect(screen.getByText('typing...')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<ConversationItem {...mockProps} />);
    const item = screen.getByText('John Doe').closest('div');
    item?.click();
    expect(mockProps.onClick).toHaveBeenCalled();
  });
});
