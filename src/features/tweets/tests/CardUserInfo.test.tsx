import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardUserInfo from '../components/CardUserInfo';

const mockUser = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  verified: true,
  avatar: 'avatar.jpg',
};

describe('CardUserInfo Component', () => {
  it('should render user name and username', () => {
    render(<CardUserInfo data={mockUser} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should show verified badge for verified users', () => {
    render(<CardUserInfo data={mockUser} />);

    // Check if verified icon SVG is present
    const svg = document.querySelector('svg[viewBox="0 0 24 24"]');
    expect(svg).toBeInTheDocument();
  });

  it('should not show verified badge for non-verified users', () => {
    const unverifiedUser = { ...mockUser, verified: false };
    render(<CardUserInfo data={unverifiedUser} />);

    // Should not have verified badge
    const verifiedIcon = document.querySelector('.text-blue-400');
    expect(verifiedIcon).not.toBeInTheDocument();
  });
});
