import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import ChatInput from '../components/chatwindow/ChatInput';

describe('ChatInput', () => {
  const mockProps = {
    message: '',
    error: null,
    onMessageChange: vi.fn(),
    onSend: vi.fn(),
    onKeyPress: vi.fn(),
    onTyping: vi.fn(),
  };

  it('should render input field with placeholder', () => {
    render(<ChatInput {...mockProps} />);
    const input = screen.getByPlaceholderText('Start a new message');
    expect(input).toBeInTheDocument();
  });

  it('should call onMessageChange when typing', () => {
    render(<ChatInput {...mockProps} />);
    const input = screen.getByPlaceholderText('Start a new message');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(mockProps.onMessageChange).toHaveBeenCalledWith('Hello');
  });

  it('should call onTyping when user types', () => {
    render(<ChatInput {...mockProps} />);
    const input = screen.getByPlaceholderText('Start a new message');
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(mockProps.onTyping).toHaveBeenCalled();
  });

  it('should display character count when message is not empty', () => {
    render(<ChatInput {...mockProps} message="Hello world" />);
    expect(screen.getByText('11/1000')).toBeInTheDocument();
  });

  it('should disable send button when message is empty', () => {
    render(<ChatInput {...mockProps} message="" />);
    const buttons = screen.getAllByRole('button');
    const sendBtn = buttons[buttons.length - 1];
    expect(sendBtn).toBeDisabled();
  });

  it('should enable send button when message has content', () => {
    render(<ChatInput {...mockProps} message="Hello" />);
    const buttons = screen.getAllByRole('button');
    const sendBtn = buttons[buttons.length - 1];
    expect(sendBtn).not.toBeDisabled();
  });

  it('should show error text in red when over character limit', () => {
    const longMessage = 'a'.repeat(1001);
    render(<ChatInput {...mockProps} message={longMessage} />);
    const charCount = screen.getByText('1001/1000');
    expect(charCount).toHaveClass('text-red-500');
  });
});
