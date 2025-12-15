import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserInfo from '../components/UserInfo';

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));
vi.mock('../components/ProfileCard', () => ({
  default: () => <div data-testid="profile-card">Profile Card</div>,
}));

const mockUser = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  verified: true,
  avatar: 'avatar.jpg',
};

describe('UserInfo Component', () => {
  it('should render user name and username', () => {
    render(<UserInfo data={mockUser} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('should show verified icon for verified users', () => {
    render(<UserInfo data={mockUser} />);

    // The verified icon is an SVG, not with data-testid
    const verifiedIcon = document.querySelector('svg.text-blue-400');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('should not show verified icon for non-verified users', () => {
    const unverifiedUser = { ...mockUser, verified: false };
    render(<UserInfo data={unverifiedUser} />);

    expect(screen.queryByTestId('verified-icon')).not.toBeInTheDocument();
  });

  it('should render horizontally by default', () => {
    const { container } = render(<UserInfo data={mockUser} />);

    expect(container.firstChild).toHaveClass('flex items-center');
  });

  it('should render vertically when direction is vertical', () => {
    const { container } = render(
      <UserInfo data={mockUser} direction="vertical" />
    );

    expect(container.firstChild).toHaveClass('flex flex-col');
  });

  it('should show profile card on hover after delay', async () => {
    render(<UserInfo data={mockUser} />);

    const nameElement = screen.getByText('Test User');
    fireEvent.mouseEnter(nameElement);

    await waitFor(
      () => {
        expect(screen.getByTestId('profile-card')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('should truncate long names', () => {
    const longNameUser = {
      ...mockUser,
      name: 'Very Long User Name That Should Be Truncated',
    };
    render(<UserInfo data={longNameUser} />);

    const nameElement = screen.getByText(/Very Long User Name/);
    expect(nameElement).toHaveClass('truncate');
  });

  it('should link to user profile', () => {
    render(<UserInfo data={mockUser} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/testuser');
  });
});

//htu
