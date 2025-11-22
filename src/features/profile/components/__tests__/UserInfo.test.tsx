import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import UserInfo from '../UserInfo';

describe('UserInfo', () => {
  const mockProps = {
    name: 'John Doe',
    username: 'johndoe',
  };

  it('should render user info container', () => {
    render(<UserInfo {...mockProps} />);

    const container = screen.getByTestId('profile-user-info');
    expect(container).toBeInTheDocument();
  });

  it('should display user name', () => {
    render(<UserInfo {...mockProps} />);

    const name = screen.getByTestId('profile-name');
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent('John Doe');
  });

  it('should display username with @ symbol', () => {
    render(<UserInfo {...mockProps} />);

    const username = screen.getByTestId('profile-username');
    expect(username).toBeInTheDocument();
    expect(username).toHaveTextContent('@johndoe');
  });

  it('should have correct styling for name', () => {
    render(<UserInfo {...mockProps} />);

    const name = screen.getByTestId('profile-name');
    expect(name).toHaveClass('font-inter', 'font-bold', 'text-xl');
  });

  it('should have correct styling for username', () => {
    render(<UserInfo {...mockProps} />);

    const username = screen.getByTestId('profile-username');
    expect(username).toHaveClass(
      'font-inter',
      'text-sm',
      'text-text-placeholder'
    );
  });

  it('should render different usernames correctly', () => {
    const { rerender } = render(<UserInfo name="Alice" username="alice123" />);
    expect(screen.getByTestId('profile-username')).toHaveTextContent(
      '@alice123'
    );

    rerender(<UserInfo name="Bob" username="bob_the_builder" />);
    expect(screen.getByTestId('profile-username')).toHaveTextContent(
      '@bob_the_builder'
    );
  });

  it('should handle long names', () => {
    const longName = 'This is a very long name that might wrap';
    render(<UserInfo name={longName} username="shortname" />);

    const name = screen.getByTestId('profile-name');
    expect(name).toHaveTextContent(longName);
  });

  it('should have correct container styling', () => {
    render(<UserInfo {...mockProps} />);

    const container = screen.getByTestId('profile-user-info');
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-start',
      'p-4',
      'gap-1',
      'w-full'
    );
  });
});
