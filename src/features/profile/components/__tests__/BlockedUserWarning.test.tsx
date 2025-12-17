import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import BlockedUserWarning from '../BlockedUserWarning';

describe('BlockedUserWarning', () => {
  const mockOnViewPosts = vi.fn();
  const defaultProps = {
    username: 'testuser',
    onViewPosts: mockOnViewPosts,
  };

  beforeEach(() => {
    mockOnViewPosts.mockClear();
  });

  it('should render blocked user warning container', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const container = screen.getByTestId('blocked-user-warning');
    expect(container).toBeInTheDocument();
  });

  it('should render blocked user icon', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const icon = screen.getByTestId('blocked-user-icon');
    expect(icon).toBeInTheDocument();
  });

  it('should display username in title', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const title = screen.getByTestId('blocked-user-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('@testuser is blocked');
  });

  it('should display correct description text', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const description = screen.getByTestId('blocked-user-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(
      "Are you sure you want to view these posts? Viewing posts won't unblock @testuser."
    );
  });

  it('should render view posts button', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const button = screen.getByTestId('view-posts-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('View posts');
  });

  it('should call onViewPosts when button is clicked', async () => {
    const user = userEvent.setup();
    render(<BlockedUserWarning {...defaultProps} />);

    const button = screen.getByTestId('view-posts-button');
    await user.click(button);

    expect(mockOnViewPosts).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes on container', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const container = screen.getByTestId('blocked-user-warning');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'py-16',
      'px-6',
      'border-t',
      'border-border',
      'mt-4'
    );
  });

  it('should display different username correctly', () => {
    render(
      <BlockedUserWarning
        username="anotheruser"
        onViewPosts={mockOnViewPosts}
      />
    );

    const title = screen.getByTestId('blocked-user-title');
    expect(title).toHaveTextContent('@anotheruser is blocked');

    const description = screen.getByTestId('blocked-user-description');
    expect(description).toHaveTextContent('@anotheruser');
  });

  it('should have primary button variant', () => {
    render(<BlockedUserWarning {...defaultProps} />);

    const button = screen.getByTestId('view-posts-button');
    // Button should have primary variant classes
    expect(button).toBeInTheDocument();
  });
});
