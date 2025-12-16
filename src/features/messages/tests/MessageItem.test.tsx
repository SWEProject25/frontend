import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageItem from '../components/MessageItem';

describe('MessageItem', () => {
  const mockMessage = {
    id: 1,
    senderId: 123,
    conversationId: 456,
    text: 'Test message',
    isSeen: false,
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-15T10:00:00Z',
  };

  const onDelete = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render message bubble', () => {
    render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={false}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should align to right when isCurrentUser is true', () => {
    const { container } = render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    const messageContainer = container.querySelector('.justify-end');
    expect(messageContainer).toBeInTheDocument();
  });

  it('should align to left when isCurrentUser is false', () => {
    const { container } = render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={false}
        onDelete={onDelete}
      />
    );

    const messageContainer = container.querySelector('.justify-start');
    expect(messageContainer).toBeInTheDocument();
  });

  it('should show more button only for current user', () => {
    const { rerender } = render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    expect(screen.getByLabelText('More options')).toBeInTheDocument();

    rerender(
      <MessageItem
        message={mockMessage}
        isCurrentUser={false}
        onDelete={onDelete}
      />
    );

    expect(screen.queryByLabelText('More options')).not.toBeInTheDocument();
  });

  it('should toggle menu when more button is clicked', () => {
    render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    const moreButton = screen.getByLabelText('More options');

    // Menu should not be visible initially
    expect(screen.queryByText('unsend')).not.toBeInTheDocument();

    // Click to show menu
    fireEvent.click(moreButton);
    expect(screen.getByText('unsend')).toBeInTheDocument();

    // Click again to hide menu
    fireEvent.click(moreButton);
    expect(screen.queryByText('unsend')).not.toBeInTheDocument();
  });

  it('should close menu on mouse leave', () => {
    const { container } = render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    const moreButton = screen.getByLabelText('More options');

    // Open menu
    fireEvent.click(moreButton);
    expect(screen.getByText('unsend')).toBeInTheDocument();

    // Mouse leave should close menu
    const messageContainer = container.querySelector(
      `#message-item-${mockMessage.id}`
    );
    fireEvent.mouseLeave(messageContainer!);

    expect(screen.queryByText('unsend')).not.toBeInTheDocument();
  });

  it('should call onDelete when delete is clicked from menu', () => {
    render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    const moreButton = screen.getByLabelText('More options');

    // Open menu
    fireEvent.click(moreButton);

    // Click delete
    const deleteButton = screen.getByText('unsend');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(mockMessage.id);
  });

  it('should have correct message item id', () => {
    const { container } = render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={false}
        onDelete={onDelete}
      />
    );

    const messageItem = container.querySelector(
      `#message-item-${mockMessage.id}`
    );
    expect(messageItem).toBeInTheDocument();
  });

  it('should have correct more button id', () => {
    render(
      <MessageItem
        message={mockMessage}
        isCurrentUser={true}
        onDelete={onDelete}
      />
    );

    const moreButton = document.querySelector(
      `#message-more-${mockMessage.id}`
    );
    expect(moreButton).toBeInTheDocument();
  });
});
