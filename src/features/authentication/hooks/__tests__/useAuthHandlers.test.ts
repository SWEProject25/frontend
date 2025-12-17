import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthHandlers } from '../useAuthHandlers';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import { AUTH_CLIENT_CONFIG } from '../../constants/api';
import { AUTH_MODAL_STORAGE_KEY } from '../../utils';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useAuthHandlers', () => {
  const mockPush = vi.fn();
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockVerifyOTP = vi.fn();
  const mockOAuthLogin = vi.fn();
  const mockForgotPassword = vi.fn();
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock useRouter
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });

    // Mock useAuth
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      verifyOTP: mockVerifyOTP,
      oAuthLogin: mockOAuthLogin,
      forgotPassword: mockForgotPassword,
      resetPassword: mockResetPassword,
      isLoginLoading: false,
      isRegisterLoading: false,
      isForgotPasswordLoading: false,
      isResetPasswordLoading: false,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('handleSocialAuth', () => {
    it('should handle successful social authentication', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockOAuthLogin.mockImplementation(
        (providerId: string, onSuccess: any) => {
          onSuccess();
        }
      );

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(mockOAuthLogin).toHaveBeenCalledWith(
        'google',
        expect.any(Function)
      );
      expect(result.current.formState.success).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        AUTH_MODAL_STORAGE_KEY
      );

      // Fast-forward timer
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(mockPush).toHaveBeenCalledWith(
        AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT
      );
    });

    it('should handle social authentication error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('Social login failed');
      mockOAuthLogin.mockImplementation(() => {
        throw error;
      });

      await act(async () => {
        await result.current.handleSocialAuth('github');
      });

      expect(result.current.formState.errors.social).toBe(
        'Social login failed'
      );
      expect(result.current.formState.success).toBe(false);
      expect(result.current.formState.isLoading).toBe(false);
    });

    it('should handle unknown error in social authentication', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockOAuthLogin.mockImplementation(() => {
        throw 'Unknown error';
      });

      await act(async () => {
        await result.current.handleSocialAuth('facebook');
      });

      expect(result.current.formState.errors.social).toBe(
        'Social login failed. Please try again.'
      );
    });
  });

  describe('handleLogin', () => {
    it('should handle email step successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleLogin(
          { email: 'test@example.com' },
          'email'
        );
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should handle password step successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockLogin.mockResolvedValue({ data: { user: { id: 1 } } });

      let success;
      await act(async () => {
        success = await result.current.handleLogin(
          { email: 'test@example.com', password: 'password123' },
          'password'
        );
      });

      expect(success).toBe(true);
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.formState.success).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        AUTH_MODAL_STORAGE_KEY
      );

      // Fast-forward timer
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockPush).toHaveBeenCalledWith(
        AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT
      );
    });

    it('should handle login with identifier field', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockLogin.mockResolvedValue({ data: { user: { id: 1 } } });

      await act(async () => {
        await result.current.handleLogin(
          { identifier: 'user@test.com', password: 'pass' },
          'password'
        );
      });

      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'pass',
      });
    });

    it('should handle login error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('Invalid credentials');
      mockLogin.mockRejectedValue(error);

      let success;
      await act(async () => {
        success = await result.current.handleLogin(
          { email: 'test@example.com', password: 'wrong' },
          'password'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.login).toBe('Invalid credentials');
      expect(result.current.formState.isLoading).toBe(false);
    });

    it('should handle unknown login error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockLogin.mockRejectedValue('Network error');

      let success;
      await act(async () => {
        success = await result.current.handleLogin(
          { email: 'test@example.com', password: 'password' },
          'password'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.login).toBe(
        'Invalid email or password, please try again'
      );
    });

    it('should handle fallback case with no step', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockLogin.mockResolvedValue({ data: { user: { id: 1 } } });

      await act(async () => {
        await result.current.handleLogin({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(mockLogin).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        AUTH_MODAL_STORAGE_KEY
      );
    });
  });

  describe('handleSignup', () => {
    it('should handle register step successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleSignup({}, 'register');
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
    });

    it('should handle captcha step successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleSignup({}, 'captcha');
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
    });

    it('should handle OTP verification successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockVerifyOTP.mockResolvedValue({ success: true });

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          { email: 'test@example.com', otp: '123456' },
          'otp'
        );
      });

      expect(success).toBe(true);
      expect(mockVerifyOTP).toHaveBeenCalledWith({
        email: 'test@example.com',
        otp: '123456',
      });
      expect(result.current.formState.success).toBe(true);
    });

    it('should handle OTP verification error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('Invalid OTP');
      mockVerifyOTP.mockRejectedValue(error);

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          { email: 'test@example.com', otp: 'wrong' },
          'otp'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.otp).toBe('Invalid OTP');
    });

    it('should handle unknown OTP error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockVerifyOTP.mockRejectedValue('Unknown error');

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          { email: 'test@example.com', otp: '123456' },
          'otp'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.otp).toContain(
        'Invalid verification code'
      );
    });

    it('should handle password step and complete registration', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockRegister.mockResolvedValue({ data: { user: { id: 1 } } });

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            birthMonth: '01',
            birthDay: '15',
            birthYear: '1990',
          },
          'password'
        );
      });

      expect(success).toBe(true);
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        birthDate: expect.any(String),
      });
      expect(localStorage.removeItem).toHaveBeenCalledWith(
        AUTH_MODAL_STORAGE_KEY
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockPush).toHaveBeenCalledWith(
        AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT
      );
    });

    it('should handle registration error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('Registration failed');
      mockRegister.mockRejectedValue(error);

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            birthMonth: '01',
            birthDay: '15',
            birthYear: '1990',
          },
          'password'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.signup).toBe(
        'Registration failed'
      );
    });

    it('should handle unknown signup error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockRegister.mockRejectedValue('Unknown error');

      let success;
      await act(async () => {
        success = await result.current.handleSignup(
          {
            name: 'Test',
            email: 'test@example.com',
            password: 'pass',
            birthMonth: '01',
            birthDay: '01',
            birthYear: '2000',
          },
          'password'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.signup).toBe('Signup failed');
    });

    it('should handle default case', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleSignup({}, 'unknown');
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
    });
  });

  describe('handleForgotPassword', () => {
    it('should handle forgot password email step successfully', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockForgotPassword.mockResolvedValue({
        message: 'Password reset email sent',
      });

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword(
          { email: 'test@example.com' },
          'forgotPassword'
        );
      });

      expect(success).toBe(false); // Returns false to stay on the same page
      expect(mockForgotPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        type: 'WEB',
      });
      expect(result.current.formState.errors.forgotPasswordSuccess).toBe(
        'Password reset email sent'
      );
    });

    it('should handle email field in email step', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockForgotPassword.mockResolvedValue({
        message: 'Email sent',
      });

      await act(async () => {
        await result.current.handleForgotPassword(
          { email: 'user@test.com' },
          'email'
        );
      });

      expect(mockForgotPassword).toHaveBeenCalledWith({
        email: 'user@test.com',
        type: 'WEB',
      });
    });

    it('should handle missing email', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword(
          {},
          'forgotPassword'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.forgotPassword).toBe(
        'Email is required'
      );
    });

    it('should handle forgot password error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('User not found');
      mockForgotPassword.mockRejectedValue(error);

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword(
          { email: 'notfound@example.com' },
          'forgotPassword'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.forgotPassword).toBe(
        'User not found'
      );
    });

    it('should handle unknown forgot password error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockForgotPassword.mockRejectedValue('Network error');

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword(
          { email: 'test@example.com' },
          'email'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.forgotPassword).toBe(
        'Failed to request password reset'
      );
    });

    it('should handle password step', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        const promise = result.current.handleForgotPassword({}, 'password');
        vi.advanceTimersByTime(800);
        success = await promise;
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
    });

    it('should handle default case', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword({}, 'unknown');
      });

      expect(success).toBe(true);
      expect(result.current.formState.success).toBe(true);
    });

    it('should handle catch block error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      // Force an error in the outer catch block
      mockForgotPassword.mockImplementation(() => {
        throw new Error('Outer error');
      });

      let success;
      await act(async () => {
        success = await result.current.handleForgotPassword(
          { email: 'test@example.com' },
          'forgotPassword'
        );
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.forgotPassword).toBeDefined();
    });
  });

  describe('handleResetPassword', () => {
    it('should handle successful password reset', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockResetPassword.mockResolvedValue({
        message: 'Password reset successful',
      });

      let success;
      await act(async () => {
        success = await result.current.handleResetPassword({
          userId: 1,
          token: 'reset-token',
          newPassword: 'newpassword123',
          email: 'test@example.com',
        });
      });

      expect(success).toBe(true);
      expect(mockResetPassword).toHaveBeenCalledWith({
        userId: 1,
        token: 'reset-token',
        newPassword: 'newpassword123',
        email: 'test@example.com',
      });
      expect(result.current.formState.message).toBe(
        'Password reset successful'
      );
    });

    it('should handle password reset without email', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockResetPassword.mockResolvedValue({
        message: 'Success',
      });

      await act(async () => {
        await result.current.handleResetPassword({
          userId: 1,
          token: 'token',
          newPassword: 'newpass',
        });
      });

      expect(mockResetPassword).toHaveBeenCalledWith({
        userId: 1,
        token: 'token',
        newPassword: 'newpass',
        email: undefined,
      });
    });

    it('should handle password reset error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      const error = new Error('Invalid token');
      mockResetPassword.mockRejectedValue(error);

      let success;
      await act(async () => {
        success = await result.current.handleResetPassword({
          userId: 1,
          token: 'invalid-token',
          newPassword: 'newpassword',
        });
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.resetPassword).toBe(
        'Invalid token'
      );
      expect(result.current.formState.isLoading).toBe(false);
    });

    it('should handle unknown reset password error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      mockResetPassword.mockRejectedValue('Unknown error');

      let success;
      await act(async () => {
        success = await result.current.handleResetPassword({
          userId: 1,
          token: 'token',
          newPassword: 'password',
        });
      });

      expect(success).toBe(false);
      expect(result.current.formState.errors.resetPassword).toBe(
        'Failed to reset password'
      );
    });
  });

  describe('clearFormState', () => {
    it('should clear specific field error', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      // First set an error
      const error = new Error('Test error');
      mockLogin.mockRejectedValue(error);

      await act(async () => {
        await result.current.handleLogin(
          { email: 'test@example.com', password: 'wrong' },
          'password'
        );
      });

      expect(result.current.formState.errors.login).toBe('Test error');

      // Clear the specific error
      act(() => {
        result.current.clearFormState('login');
      });

      expect(result.current.formState.errors.login).toBeUndefined();
    });

    it('should clear all form state', async () => {
      const { result } = renderHook(() => useAuthHandlers());

      // Set some errors
      mockLogin.mockRejectedValue(new Error('Error'));

      await act(async () => {
        await result.current.handleLogin(
          { email: 'test', password: 'wrong' },
          'password'
        );
      });

      expect(result.current.formState.errors).not.toEqual({});

      // Clear all
      act(() => {
        result.current.clearFormState();
      });

      expect(result.current.formState).toEqual({
        isLoading: false,
        success: false,
        errors: {},
      });
    });
  });

  describe('formState isLoading', () => {
    it('should combine internal loading state with mutation loading states', () => {
      (useAuth as any).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        verifyOTP: mockVerifyOTP,
        oAuthLogin: mockOAuthLogin,
        forgotPassword: mockForgotPassword,
        resetPassword: mockResetPassword,
        isLoginLoading: true,
        isRegisterLoading: false,
        isForgotPasswordLoading: false,
        isResetPasswordLoading: false,
      });

      const { result } = renderHook(() => useAuthHandlers());

      expect(result.current.formState.isLoading).toBe(true);
    });

    it('should show loading when register is loading', () => {
      (useAuth as any).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        verifyOTP: mockVerifyOTP,
        oAuthLogin: mockOAuthLogin,
        forgotPassword: mockForgotPassword,
        resetPassword: mockResetPassword,
        isLoginLoading: false,
        isRegisterLoading: true,
        isForgotPasswordLoading: false,
        isResetPasswordLoading: false,
      });

      const { result } = renderHook(() => useAuthHandlers());

      expect(result.current.formState.isLoading).toBe(true);
    });

    it('should show loading when forgot password is loading', () => {
      (useAuth as any).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        verifyOTP: mockVerifyOTP,
        oAuthLogin: mockOAuthLogin,
        forgotPassword: mockForgotPassword,
        resetPassword: mockResetPassword,
        isLoginLoading: false,
        isRegisterLoading: false,
        isForgotPasswordLoading: true,
        isResetPasswordLoading: false,
      });

      const { result } = renderHook(() => useAuthHandlers());

      expect(result.current.formState.isLoading).toBe(true);
    });

    it('should show loading when reset password is loading', () => {
      (useAuth as any).mockReturnValue({
        login: mockLogin,
        register: mockRegister,
        verifyOTP: mockVerifyOTP,
        oAuthLogin: mockOAuthLogin,
        forgotPassword: mockForgotPassword,
        resetPassword: mockResetPassword,
        isLoginLoading: false,
        isRegisterLoading: false,
        isForgotPasswordLoading: false,
        isResetPasswordLoading: true,
      });

      const { result } = renderHook(() => useAuthHandlers());

      expect(result.current.formState.isLoading).toBe(true);
    });
  });
});
