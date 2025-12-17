import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import SeenStatus from '../components/MessageItem/SeenStatus';

describe('SeenStatus', () => {
  it('should show "Seen" when message is seen and from current user', () => {
    render(<SeenStatus isSeen={true} isCurrentUser={true} />);
    expect(screen.getByText('Seen')).toBeInTheDocument();
  });

  it('should not show anything when message is not seen', () => {
    const { container } = render(
      <SeenStatus isSeen={false} isCurrentUser={true} />
    );
    expect(container.textContent).toBe('');
  });

  it('should not show anything for other user messages', () => {
    const { container } = render(
      <SeenStatus isSeen={true} isCurrentUser={false} />
    );
    expect(container.textContent).toBe('');
  });

  it('should have proper styling when displayed', () => {
    const { container } = render(
      <SeenStatus isSeen={true} isCurrentUser={true} />
    );
    const seenText = container.querySelector('.text-\\[10px\\]');
    expect(seenText).toBeInTheDocument();
  });
});
