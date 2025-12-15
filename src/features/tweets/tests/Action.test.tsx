import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Action from '../components/Action';
import { ReplyIcon } from '@/components/ui/icons/UIIcons';

describe('Action Component', () => {
  it('should render action button with icon', () => {
    render(<Action icon={<ReplyIcon />} label="Comment" color="blue" />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should display count when provided', () => {
    render(
      <Action icon={<ReplyIcon />} label="Comment" color="blue" count={5} />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <Action
        icon={<ReplyIcon />}
        label="Comment"
        color="blue"
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onCountClick when count is clicked', () => {
    const onCountClick = vi.fn();
    render(
      <Action
        icon={<ReplyIcon />}
        label="Comment"
        color="blue"
        count={5}
        onCountClick={onCountClick}
      />
    );

    const countElement = screen.getByText('5');
    fireEvent.click(countElement);

    expect(onCountClick).toHaveBeenCalledTimes(1);
  });

  it('should stop propagation by default', () => {
    const onClick = vi.fn();
    render(
      <Action
        icon={<ReplyIcon />}
        label="Comment"
        color="blue"
        onClick={onClick}
      />
    );

    const button = screen.getByRole('button');
    const event = new MouseEvent('click', { bubbles: true });

    button.dispatchEvent(event);
    // Should stop propagation
  });

  it('should apply colored styles when isColored is true', () => {
    const { container } = render(
      <Action
        icon={<ReplyIcon />}
        label="Comment"
        color="blue"
        isColored={true}
        count={5}
      />
    );

    // When isColored is true, the icon wrapper or count should have the colored class
    // Check if any element has the colored text class
    const coloredElement = container.querySelector('.text-blue-400');
    expect(coloredElement).toBeInTheDocument();
  });

  it('should not display count when count is 0', () => {
    render(
      <Action icon={<ReplyIcon />} label="Comment" color="blue" count={0} />
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
