import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import ProfileSection from '../components/ProfileSection';

vi.mock('@/features/authentication/store/authStore');

vi.mock('../components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

describe('ProfileSection', () => {
  it('should render profile menu', () => {
    render(<ProfileSection />);

    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
  });

  it('should render with proper testid', () => {
    render(<ProfileSection />);

    expect(screen.getByTestId('sidebar-profile-section')).toBeInTheDocument();
  });

  it('should render component structure', () => {
    const { container } = render(<ProfileSection />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
