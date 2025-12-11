import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import ChatHeader from '../components/chatwindow/ChatHeader';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ChatHeader', () => {
  const defaultProps = {
    name: 'John Doe',
    username: 'johndoe',
    avatar: 'https://example.com/avatar.jpg',
    isVerified: false,
    isTyping: false,
  };

  it('should render user name', () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render username with @ symbol', () => {
    render(<ChatHeader {...defaultProps} />);
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
  });

  it('should show verified badge when user is verified', () => {
    render(<ChatHeader {...defaultProps} isVerified={true} />);
    const badge = document.querySelector('svg');
    expect(badge).toBeInTheDocument();
  });

  it('should not show verified badge when user is not verified', () => {
    render(<ChatHeader {...defaultProps} isVerified={false} />);
    const badge = document.querySelector('.text-blue-500');
    expect(badge).not.toBeInTheDocument();
  });

  it('should navigate to user profile when clicking avatar', () => {
    render(<ChatHeader {...defaultProps} />);
    const avatarButton = screen.getByLabelText("View John Doe's profile");
    fireEvent.click(avatarButton);
    expect(mockPush).toHaveBeenCalledWith('/johndoe');
  });
});
