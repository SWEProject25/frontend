import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyConversation from '../components/chatwindow/EmptyConversation';

describe('EmptyConversation', () => {
  const mockProps = {
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'avatar.jpg',
  };

  it('should render conversation beginning message', () => {
    render(<EmptyConversation {...mockProps} />);
    const message = screen.getByText(
      /this is the beginning of your conversation with @johndoe/i
    );
    expect(message).toBeInTheDocument();
  });

  it('should render user name', () => {
    render(<EmptyConversation {...mockProps} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('should render username with @ symbol', () => {
    render(<EmptyConversation {...mockProps} />);
    // Use a more specific selector to avoid matching multiple elements
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName === 'P' &&
          element?.className.includes('text-sm') &&
          !element?.className.includes('max-w-xs') &&
          content.includes('@johndoe')
        );
      })
    ).toBeInTheDocument();
  });
});
