import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import BlockedByUserNotice from '../BlockedByUserNotice';

describe('BlockedByUserNotice', () => {
  const defaultProps = {
    username: 'testuser',
  };

  it('should render blocked by user notice container', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const container = screen.getByTestId('blocked-by-user-notice');
    expect(container).toBeInTheDocument();
  });

  it('should display username in title', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const title = screen.getByTestId('blocked-by-user-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('@testuser has blocked you');
  });

  it('should display correct description text', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const description = screen.getByTestId('blocked-by-user-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      'You can view public posts from @testuser, but you are blocked from engaging with them. You also cannot follow or message @testuser.'
    );
  });

  it('should have correct styling classes on container', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const container = screen.getByTestId('blocked-by-user-notice');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'py-6',
      'px-6',
      'border-t',
      'border-border',
      'bg-muted/30'
    );
  });

  it('should display different username correctly', () => {
    render(<BlockedByUserNotice username="anotheruser" />);

    const title = screen.getByTestId('blocked-by-user-title');
    expect(title).toHaveTextContent('@anotheruser has blocked you');

    const description = screen.getByTestId('blocked-by-user-description');
    expect(description).toHaveTextContent('@anotheruser');
  });

  it('should have correct title styling', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const title = screen.getByTestId('blocked-by-user-title');
    expect(title).toHaveClass('text-xl', 'font-bold', 'text-text-active');
  });

  it('should have correct description styling', () => {
    render(<BlockedByUserNotice {...defaultProps} />);

    const description = screen.getByTestId('blocked-by-user-description');
    expect(description).toHaveClass(
      'text-sm',
      'text-text-secondary',
      'leading-relaxed'
    );
  });
});
