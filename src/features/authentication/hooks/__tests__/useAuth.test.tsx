import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useAuth,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  authKeys,
} from '../useAuth';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';

// Mock dependencies
vi.mock('../../services/authApi');
vi.mock('../../store/authStore');

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  created_at: '2023-01-01',
  onboardingStatus: 'completed',
};

const mockAuthStoreState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: vi.fn(),
  clearUser: vi.fn(),
  setLoading: vi.fn(),
  setPasswordVerified: vi.fn(),
  checkPasswordVerification: vi.fn(),
  updateEmail: vi.fn(),
  updateUsername: vi.fn(),
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return { Wrapper, queryClient };
};

describe('useAuth Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAuthStore
    (useAuthStore as any).mockImplementation((selector: any) => {
      if (typeof selector === 'function') {
        return selector(mockAuthStoreState);
      }
      return mockAuthStoreState;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('authKeys', () => {
    it('should return correct query keys', () => {
      expect(authKeys.all).toEqual(['auth']);
      expect(authKeys.user()).toEqual(['auth', 'user']);
    });
  });

  describe('useLoginMutation', () => {
    it('should handle successful login', async () => {
      const mockResponse = {
        data: {
          user: mockUser,
          onboardingStatus: 'completed',
        },
      };

      (authApi.login as any).mockResolvedValue(mockResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(mockAuthStoreState.setUser).toHaveBeenCalledWith({
          ...mockUser,
          onboardingStatus: 'completed',
        });
      });
    });

    it('should set loading on mutation start', async () => {
      const mockResponse = {
        data: { user: mockUser, onboardingStatus: 'pending' },
      };

      (authApi.login as any).mockResolvedValue(mockResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: Wrapper,
      });

      act(() => {
        result.current.mutate({
          email: 'test@example.com',
          password: 'password',
        });
      });

      await waitFor(() => {
        expect(mockAuthStoreState.setLoading).toHaveBeenCalledWith(true);
      });
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (authApi.login as any).mockRejectedValue(error);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: Wrapper,
      });

      await expect(
        result.current.mutateAsync({
          email: 'test@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow('Invalid credentials');

      await waitFor(() => {
        expect(mockAuthStoreState.setLoading).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('useRegisterMutation', () => {
    it('should handle successful registration', async () => {
      const mockResponse = {
        data: { user: mockUser, onboardingStatus: 'pending' },
      };

      (authApi.register as any).mockResolvedValue(mockResponse);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          birthDate: '1990-01-01',
        });
      });

      await waitFor(() => {
        expect(mockAuthStoreState.setUser).toHaveBeenCalledWith({
          ...mockUser,
          onboardingStatus: 'pending',
        });
      });
    });

    it('should handle registration error', async () => {
      const error = new Error('Email already exists');
      (authApi.register as any).mockRejectedValue(error);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: Wrapper,
      });

      await expect(
        result.current.mutateAsync({
          name: 'Test',
          email: 'exists@example.com',
          password: 'password',
          birthDate: '1990-01-01',
        })
      ).rejects.toThrow('Email already exists');

      await waitFor(() => {
        expect(mockAuthStoreState.setLoading).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('useLogoutMutation', () => {
    it('should handle successful logout', async () => {
      (authApi.logout as any).mockResolvedValue({ success: true });

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useLogoutMutation(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        await result.current.mutateAsync();
      });

      await waitFor(() => {
        expect(mockAuthStoreState.clearUser).toHaveBeenCalled();
      });
    });

    it('should clear user even on logout error', async () => {
      const error = new Error('Logout failed');
      (authApi.logout as any).mockRejectedValue(error);

      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useLogoutMutation(), {
        wrapper: Wrapper,
      });

      await act(async () => {
        try {
          await result.current.mutateAsync();
        } catch (e) {
          // Expected to throw
        }
      });

      await waitFor(() => {
        expect(mockAuthStoreState.clearUser).toHaveBeenCalled();
      });
    });
  });

  describe('useAuth', () => {
    beforeEach(() => {
      (authApi.login as any).mockResolvedValue({
        data: { user: mockUser, onboardingStatus: 'completed' },
      });
      (authApi.register as any).mockResolvedValue({
        data: { user: mockUser, onboardingStatus: 'pending' },
      });
      (authApi.logout as any).mockResolvedValue({ success: true });
      (authApi.verifyPassword as any).mockResolvedValue({ valid: true });
      (authApi.forgotPassword as any).mockResolvedValue({
        message: 'Email sent',
      });
      (authApi.resetPassword as any).mockResolvedValue({ message: 'Success' });
      (authApi.sendOTP as any).mockResolvedValue({ message: 'OTP sent' });
      (authApi.verifyOTP as any).mockResolvedValue({ valid: true });
      (authApi.resendOTP as any).mockResolvedValue({ message: 'OTP resent' });
      (authApi.updateEmail as any).mockResolvedValue({ success: true });
      (authApi.updateUsername as any).mockResolvedValue({ success: true });
      (authApi.changePassword as any).mockResolvedValue({ message: 'Changed' });
      (authApi.oAuthLogin as any).mockImplementation((p: string, cb: any) => {
        cb(mockUser);
      });
    });

    it('should provide auth state', () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should provide auth actions', () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      expect(typeof result.current.setUser).toBe('function');
      expect(typeof result.current.clearUser).toBe('function');
      expect(typeof result.current.setLoading).toBe('function');
      expect(typeof result.current.setPasswordVerified).toBe('function');
      expect(typeof result.current.checkPasswordVerification).toBe('function');
    });

    it('should provide mutation functions', () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.verifyPassword).toBe('function');
      expect(typeof result.current.forgotPassword).toBe('function');
      expect(typeof result.current.resetPassword).toBe('function');
      expect(typeof result.current.sendOTP).toBe('function');
      expect(typeof result.current.verifyOTP).toBe('function');
      expect(typeof result.current.resendOTP).toBe('function');
      expect(typeof result.current.updateEmail).toBe('function');
      expect(typeof result.current.updateUsername).toBe('function');
      expect(typeof result.current.changePassword).toBe('function');
      expect(typeof result.current.oAuthLogin).toBe('function');
    });

    it('should provide loading states', () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      expect(result.current.isLoginLoading).toBe(false);
      expect(result.current.isRegisterLoading).toBe(false);
      expect(result.current.isLogoutLoading).toBe(false);
      expect(result.current.isVerifyPasswordLoading).toBe(false);
      expect(result.current.isForgotPasswordLoading).toBe(false);
      expect(result.current.isResetPasswordLoading).toBe(false);
      expect(result.current.isSendOTPLoading).toBe(false);
      expect(result.current.isVerifyOTPLoading).toBe(false);
      expect(result.current.isResendOTPLoading).toBe(false);
      expect(result.current.isUpdateEmailLoading).toBe(false);
      expect(result.current.isUpdateUsernameLoading).toBe(false);
      expect(result.current.isChangePasswordLoading).toBe(false);
    });

    it('should call login mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password',
        });
      });

      expect(authApi.login).toHaveBeenCalled();
      // Check first argument matches
      const callArgs = (authApi.login as any).mock.calls[0];
      expect(callArgs[0]).toEqual({
        email: 'test@example.com',
        password: 'password',
      });
    });

    it('should call register mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.register({
          name: 'Test',
          email: 'test@example.com',
          password: 'password',
          birthDate: '1990-01-01',
        });
      });

      expect(authApi.register).toHaveBeenCalled();
    });

    it('should call verifyPassword mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.verifyPassword({ password: 'password' });
      });

      expect(authApi.verifyPassword).toHaveBeenCalled();
    });

    it('should call forgotPassword mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.forgotPassword({
          email: 'test@example.com',
          type: 'WEB',
        });
      });

      expect(authApi.forgotPassword).toHaveBeenCalled();
    });

    it('should call resetPassword mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.resetPassword({
          userId: 1,
          token: 'token',
          newPassword: 'newpass',
        });
      });

      expect(authApi.resetPassword).toHaveBeenCalled();
    });

    it('should call sendOTP mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.sendOTP({ email: 'test@example.com' });
      });

      expect(authApi.sendOTP).toHaveBeenCalled();
    });

    it('should call verifyOTP mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.verifyOTP({
          email: 'test@example.com',
          otp: '123456',
        });
      });

      expect(authApi.verifyOTP).toHaveBeenCalled();
    });

    it('should call updateEmail mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.updateEmail({ email: 'new@example.com' });
      });

      expect(authApi.updateEmail).toHaveBeenCalled();
    });

    it('should call updateUsername mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.updateUsername({ username: 'newuser' });
      });

      expect(authApi.updateUsername).toHaveBeenCalled();
    });

    it('should call changePassword mutation', async () => {
      const { Wrapper } = createWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

      await act(async () => {
        await result.current.changePassword({
          oldPassword: 'old',
          newPassword: 'new',
        });
      });

      expect(authApi.changePassword).toHaveBeenCalled();
    });
  });
});
