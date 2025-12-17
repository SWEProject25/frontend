import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordLink from '../ForgotPasswordLink';
import { useAuth } from '@/features/authentication/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/features/authentication/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the components
vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, variant, loading, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-loading={loading}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/icons', () => ({
  CheckIcon: ({ className }: any) => (
    <div className={className} data-testid="check-icon">
      ✓
    </div>
  ),
}));

const mockForgotPassword = vi.fn();
const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
};

describe('ForgotPasswordLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      forgotPassword: mockForgotPassword,
      isForgotPasswordLoading: false,
      user: mockUser,
    } as any);
  });

  describe('Initial State', () => {
    it('should render the form with correct title and description', () => {
      render(<ForgotPasswordLink />);

      expect(
        screen.getByTestId('forgot-password-link-form')
      ).toBeInTheDocument();
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
      expect(
        screen.getByText(/We'll send a password reset link to/)
      ).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });

    it('should render Cancel and Send Reset Link buttons', () => {
      render(<ForgotPasswordLink />);

      expect(
        screen.getByTestId('forgot-password-link-cancel-button')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('forgot-password-link-send-button')
      ).toBeInTheDocument();
    });

    it('should use custom testId when provided', () => {
      render(<ForgotPasswordLink data-testid="custom-forgot-link" />);

      expect(screen.getByTestId('custom-forgot-link-form')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-forgot-link-cancel-button')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-forgot-link-send-button')
      ).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should show success message after successful password reset request', async () => {
      mockForgotPassword.mockResolvedValue({ status: 'success' });

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-success')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Check your email')).toBeInTheDocument();
      expect(
        screen.getByText(/We've sent a password reset link to/)
      ).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(
        screen.getByTestId('forgot-password-link-back-button')
      ).toBeInTheDocument();
    });

    it('should call forgotPassword with correct parameters', async () => {
      mockForgotPassword.mockResolvedValue({ status: 'success' });

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockForgotPassword).toHaveBeenCalledWith({
          email: mockUser.email,
          type: 'WEB',
        });
      });
    });

    it('should call onCancel when Back button is clicked in success state', async () => {
      const onCancel = vi.fn();
      mockForgotPassword.mockResolvedValue({ status: 'success' });

      render(<ForgotPasswordLink onCancel={onCancel} />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-back-button')
        ).toBeInTheDocument();
      });

      const backButton = screen.getByTestId('forgot-password-link-back-button');
      fireEvent.click(backButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('should display error message when user email is not found', async () => {
      vi.mocked(useAuth).mockReturnValue({
        forgotPassword: mockForgotPassword,
        isForgotPasswordLoading: false,
        user: { ...mockUser, email: undefined },
      } as any);

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-error')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('User email not found. Please log in again.')
      ).toBeInTheDocument();
    });

    it('should display error message when forgotPassword throws an error', async () => {
      const errorMessage = 'Network error';
      mockForgotPassword.mockRejectedValue(new Error(errorMessage));

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-error')
        ).toBeInTheDocument();
      });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display default error message when error has no message', async () => {
      mockForgotPassword.mockRejectedValue({});

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-error')
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText('Failed to send reset email. Please try again.')
      ).toBeInTheDocument();
    });

    it('should clear error when Cancel button is clicked', async () => {
      mockForgotPassword.mockRejectedValue(new Error('Test error'));

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('forgot-password-link-error')
        ).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId(
        'forgot-password-link-cancel-button'
      );
      fireEvent.click(cancelButton);

      // After cancel, form should reset and error should be cleared
      expect(
        screen.queryByTestId('forgot-password-link-error')
      ).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading state on Send button when request is in progress', () => {
      vi.mocked(useAuth).mockReturnValue({
        forgotPassword: mockForgotPassword,
        isForgotPasswordLoading: true,
        user: mockUser,
      } as any);

      render(<ForgotPasswordLink />);

      const sendButton = screen.getByTestId('forgot-password-link-send-button');
      expect(sendButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when Cancel button is clicked', () => {
      const onCancel = vi.fn();

      render(<ForgotPasswordLink onCancel={onCancel} />);

      const cancelButton = screen.getByTestId(
        'forgot-password-link-cancel-button'
      );
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });

    it('should not throw error when onCancel is not provided', () => {
      render(<ForgotPasswordLink />);

      const cancelButton = screen.getByTestId(
        'forgot-password-link-cancel-button'
      );

      expect(() => fireEvent.click(cancelButton)).not.toThrow();
    });
  });
});
