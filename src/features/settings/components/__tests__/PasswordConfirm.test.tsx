import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PasswordConfirm from '../PasswordConfirm';
import { useAuth } from '@/features/authentication/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/features/authentication/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the components
vi.mock('@/components/ui/input', () => ({
  InputField: ({ label, value, onChange, error, type, ...props }: any) => (
    <div>
      <label htmlFor={props['data-testid']}>{label}</label>
      <input
        id={props['data-testid']}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        {...props}
      />
      {error && <div data-testid="input-error">{error}</div>}
    </div>
  ),
}));

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, disabled, loading, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-loading={loading}
      {...props}
    >
      {children}
    </button>
  ),
}));

vi.mock('../ForgotPasswordLink', () => ({
  default: ({ onCancel, 'data-testid': testId }: any) => (
    <div data-testid={testId}>
      <div>Forgot Password Component</div>
      <button onClick={onCancel} data-testid={`${testId}-back`}>
        Back
      </button>
    </div>
  ),
}));

const mockVerifyPassword = vi.fn();
const mockSetPasswordVerified = vi.fn();

describe('PasswordConfirm', () => {
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      verifyPassword: mockVerifyPassword,
      isVerifyPasswordLoading: false,
      setPasswordVerified: mockSetPasswordVerified,
    } as any);
  });

  describe('Initial State', () => {
    it('should render with default title and description', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      expect(screen.getByTestId('password-confirm')).toBeInTheDocument();
      expect(screen.getByTestId('password-confirm-title')).toHaveTextContent(
        'Confirm your password'
      );
      expect(
        screen.getByTestId('password-confirm-description')
      ).toHaveTextContent(
        'To access your account information, please confirm your password.'
      );
    });

    it('should render with custom title and description', () => {
      const customTitle = 'Custom Title';
      const customDescription = 'Custom Description';

      render(
        <PasswordConfirm
          onConfirm={mockOnConfirm}
          title={customTitle}
          description={customDescription}
        />
      );

      expect(screen.getByTestId('password-confirm-title')).toHaveTextContent(
        customTitle
      );
      expect(
        screen.getByTestId('password-confirm-description')
      ).toHaveTextContent(customDescription);
    });

    it('should render password input field', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      expect(screen.getByTestId('password-confirm-input')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      expect(screen.getByTestId('forgot-password-link')).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('should render Confirm button disabled when password is empty', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const confirmButton = screen.getByTestId('password-confirm-button');
      expect(confirmButton).toBeDisabled();
    });
  });

  describe('Password Input', () => {
    it('should update password value when typing', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'testpassword' } });

      expect(input).toHaveValue('testpassword');
    });

    it('should enable Confirm button when password is entered', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'testpassword' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      expect(confirmButton).not.toBeDisabled();
    });

    it('should clear error when typing after getting an error from API', async () => {
      mockVerifyPassword.mockRejectedValue(new Error('Wrong password'));

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'wrongpass' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('input-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('input-error')).toHaveTextContent(
        'Wrong password'
      );

      // Type to clear error
      fireEvent.change(input, { target: { value: 'test' } });

      expect(screen.queryByTestId('input-error')).not.toBeInTheDocument();
    });
  });

  describe('Password Verification', () => {
    it('should not allow confirm when password is empty (button disabled)', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const confirmButton = screen.getByTestId('password-confirm-button');
      expect(confirmButton).toBeDisabled();

      // Button should not be clickable when disabled
      fireEvent.click(confirmButton);

      expect(mockVerifyPassword).not.toHaveBeenCalled();
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call verifyPassword and onConfirm on successful verification', async () => {
      mockVerifyPassword.mockResolvedValue({ status: 'success' });

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'correctpassword' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockVerifyPassword).toHaveBeenCalledWith({
          password: 'correctpassword',
        });
      });

      expect(mockSetPasswordVerified).toHaveBeenCalledWith(true);
      expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('should show error when password verification fails', async () => {
      mockVerifyPassword.mockResolvedValue({ status: 'failed' });

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'wrongpassword' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('input-error')).toHaveTextContent(
          'Incorrect password. Please try again.'
        );
      });

      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should show error message from thrown error', async () => {
      const errorMessage = 'Network error';
      mockVerifyPassword.mockRejectedValue(new Error(errorMessage));

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'testpassword' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('input-error')).toHaveTextContent(
          errorMessage
        );
      });
    });

    it('should show default error when error has no message', async () => {
      mockVerifyPassword.mockRejectedValue({});

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const input = screen.getByTestId('password-confirm-input');
      fireEvent.change(input, { target: { value: 'testpassword' } });

      const confirmButton = screen.getByTestId('password-confirm-button');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId('input-error')).toHaveTextContent(
          'An error occurred. Please try again.'
        );
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state on Confirm button during verification', () => {
      vi.mocked(useAuth).mockReturnValue({
        verifyPassword: mockVerifyPassword,
        isVerifyPasswordLoading: true,
        setPasswordVerified: mockSetPasswordVerified,
      } as any);

      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const confirmButton = screen.getByTestId('password-confirm-button');
      expect(confirmButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Forgot Password Flow', () => {
    it('should show ForgotPasswordLink when forgot password link is clicked', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const forgotLink = screen.getByTestId('forgot-password-link');
      fireEvent.click(forgotLink);

      expect(
        screen.getByTestId('password-confirm-forgot-link')
      ).toBeInTheDocument();
      expect(screen.getByText('Forgot Password Component')).toBeInTheDocument();
    });

    it('should hide password confirm form when showing forgot password', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const forgotLink = screen.getByTestId('forgot-password-link');
      fireEvent.click(forgotLink);

      expect(
        screen.queryByTestId('password-confirm-header')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('password-confirm-input')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('password-confirm-actions')
      ).not.toBeInTheDocument();
    });

    it('should return to password confirm when back is clicked from forgot password', () => {
      render(<PasswordConfirm onConfirm={mockOnConfirm} />);

      const forgotLink = screen.getByTestId('forgot-password-link');
      fireEvent.click(forgotLink);

      const backButton = screen.getByTestId(
        'password-confirm-forgot-link-back'
      );
      fireEvent.click(backButton);

      expect(screen.getByTestId('password-confirm-header')).toBeInTheDocument();
      expect(
        screen.queryByText('Forgot Password Component')
      ).not.toBeInTheDocument();
    });
  });
});
