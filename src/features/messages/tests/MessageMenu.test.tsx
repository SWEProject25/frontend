import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageMenu from '../components/MessageItem/MessageMenu';

describe('MessageMenu', () => {
  it('should not render when show is false', () => {
    const { container } = render(
      <MessageMenu show={false} onDelete={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when show is true', () => {
    render(<MessageMenu show={true} onDelete={vi.fn()} />);
    expect(screen.getByText('unsend')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<MessageMenu show={true} onDelete={onDelete} />);

    const deleteButton = screen.getByText('unsend');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes', () => {
    render(<MessageMenu show={true} onDelete={vi.fn()} />);

    const container = screen.getByText('unsend').closest('div');
    expect(container).toHaveClass(
      'bg-gray-950',
      'border',
      'border-gray-800',
      'rounded-lg'
    );
  });

  it('should have hover effect on button', () => {
    render(<MessageMenu show={true} onDelete={vi.fn()} />);

    const deleteButton = screen.getByText('unsend');
    expect(deleteButton).toHaveClass('hover:bg-gray-800');
  });
});
