import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MessagesPage from '@/app/messages/page';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the auth hook
vi.mock('@/features/authentication/hooks', () => ({
  useAuth: vi.fn(),
}));

// Mock MessagesLayout component
vi.mock('@/features/messages/components/MessagesLayout', () => ({
  default: () => <div data-testid="messages-layout">Messages</div>,
}));

import { useAuth } from '@/features/authentication/hooks';

describe('MessagesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render messages layout when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      user: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    } as any);

    render(<MessagesPage />);
    expect(screen.getByTestId('messages-layout')).toBeInTheDocument();
  });

  it('should show authentication required when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      checkAuth: vi.fn(),
    } as any);

    render(<MessagesPage />);
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
  });
});
