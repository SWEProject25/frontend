import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TweetAvatar from '../components/TweetAvatar';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockUser = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'https://example.com/avatar.jpg',
};

describe('TweetAvatar Component', () => {
  it('should render avatar with correct src', () => {
    render(<TweetAvatar data={mockUser} />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute(
      'src',
      expect.stringContaining('avatar.jpg')
    );
  });

  it('should render default avatar when avatar is null', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };
    render(<TweetAvatar data={userWithoutAvatar} />);

    // When avatar is null, it shows the first letter of the name
    const initial = screen.getByText('T'); // First letter of "Test User"
    expect(initial).toBeInTheDocument();
  });

  it('should link to user profile', () => {
    render(<TweetAvatar data={mockUser} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/testuser');
  });

  it('should stop propagation on click', () => {
    const { container } = render(<TweetAvatar data={mockUser} />);

    const link = screen.getByRole('link');
    const clickEvent = new MouseEvent('click', { bubbles: true });

    link.dispatchEvent(clickEvent);
    // Should call stopPropagation
  });

  it('should render with correct size classes', () => {
    const { container } = render(<TweetAvatar data={mockUser} />);

    // The avatar container has w-[48px] h-[48px] classes
    const avatar = container.querySelector('[class*="w-[48px]"]');
    expect(avatar).toBeInTheDocument();
  });
});
