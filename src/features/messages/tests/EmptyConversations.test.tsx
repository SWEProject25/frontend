import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyConversations from '../components/conversationlist/EmptyConversations';

describe('EmptyConversations', () => {
  it('should render welcome heading', () => {
    render(<EmptyConversations />);
    const heading = screen.getByText(/welcome to your inbox!/i);
    expect(heading).toBeInTheDocument();
  });

  it('should render descriptive message', () => {
    render(<EmptyConversations />);
    const message = screen.getByText(
      /drop a line, share posts and more with private conversations/i
    );
    expect(message).toBeInTheDocument();
  });

  it('should render mail icon', () => {
    const { container } = render(<EmptyConversations />);
    const mailIcon = container.querySelector('svg.lucide-mail');
    expect(mailIcon).toBeInTheDocument();
  });
});
