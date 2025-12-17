import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardAvatar from '../components/CardAvatar';

const mockUser = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  verified: false,
  avatar: 'https://example.com/avatar.jpg',
};

describe('CardAvatar Component', () => {
  it('should render avatar with correct image', () => {
    render(
      <CardAvatar
        avatar={mockUser.avatar}
        name={mockUser.name}
        username={mockUser.username}
      />
    );

    const avatar = screen.getByRole('img', { name: mockUser.name });
    expect(avatar).toBeInTheDocument();
  });

  it('should render avatar with null image', () => {
    const { container } = render(
      <CardAvatar
        avatar={null}
        name={mockUser.name}
        username={mockUser.username}
      />
    );

    // When avatar is null, a letter initial should be displayed instead
    const initial = container.querySelector('span');
    expect(initial).toBeInTheDocument();
    expect(initial).toHaveTextContent('T'); // First letter of "Test User"
  });

  it('should have correct link to user profile', () => {
    render(
      <CardAvatar
        avatar={mockUser.avatar}
        name={mockUser.name}
        username={mockUser.username}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/${mockUser.username}`);
  });

  it('should render with correct size', () => {
    const { container } = render(
      <CardAvatar
        avatar={mockUser.avatar}
        name={mockUser.name}
        username={mockUser.username}
      />
    );

    const avatarWrapper = container.querySelector('[class*="w-"]');
    expect(avatarWrapper).toBeInTheDocument();
  });

  it('should prevent click propagation', () => {
    const onClick = vi.fn();
    render(
      <div onClick={onClick}>
        <CardAvatar
          avatar={mockUser.avatar}
          name={mockUser.name}
          username={mockUser.username}
        />
      </div>
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    // The CardAvatar link stops propagation, so parent onClick should not be called
    expect(onClick).not.toHaveBeenCalled();
  });
});
