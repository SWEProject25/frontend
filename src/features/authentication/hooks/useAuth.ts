import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { UserResponse } from '../types/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Login Mutation
export const useLoginMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearUser();
      queryClient.clear();
    },
  });
};

// Verify Password Mutation
export const useVerifyPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyPassword,
  });
};

// Forgot Password Mutation
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

// Reset Password Mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

// Send OTP Mutation
export const useSendOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.sendOTP,
  });
};

// Verify OTP Mutation
export const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyOTP,
  });
};

// Resend OTP Mutation
export const useResendOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.resendOTP,
  });
};

// Update Email Mutation
export const useUpdateEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateEmail,
    onSuccess: () => {
      // Invalidate auth user and profile queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: authKeys.user(),
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Update Username Mutation
export const useUpdateUsernameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateUsername,
    onSuccess: () => {
      // Invalidate auth user and profile queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: authKeys.user(),
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// OAuth Login Handler (not a mutation due to popup window mechanism)
export const useOAuthLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  return (provider: string, onSuccess?: (user: UserResponse) => void) => {
    setLoading(true);

    authApi.oAuthLogin(provider, (user) => {
      setUser(user);
      setLoading(false);
      if (onSuccess) onSuccess(user);
    });
  };
};

// Custom hook for authentication state
export const useAuth = () => {
  // Use selectors to prevent unnecessary re-renders
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setPasswordVerified = useAuthStore(
    (state) => state.setPasswordVerified
  );
  const checkPasswordVerification = useAuthStore(
    (state) => state.checkPasswordVerification
  );

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const verifyPasswordMutation = useVerifyPasswordMutation();
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const sendOTPMutation = useSendOTPMutation();
  const verifyOTPMutation = useVerifyOTPMutation();
  const resendOTPMutation = useResendOTPMutation();
  const updateEmailMutation = useUpdateEmailMutation();
  const updateUsernameMutation = useUpdateUsernameMutation();
  const oAuthLogin = useOAuthLogin();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    // Actions
    setUser,
    clearUser,
    setLoading,
    setPasswordVerified,
    checkPasswordVerification,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    verifyPassword: verifyPasswordMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    sendOTP: sendOTPMutation.mutateAsync,
    verifyOTP: verifyOTPMutation.mutateAsync,
    resendOTP: resendOTPMutation.mutateAsync,
    updateEmail: updateEmailMutation.mutateAsync,
    updateUsername: updateUsernameMutation.mutateAsync,
    oAuthLogin,
    // Mutation loading states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isVerifyPasswordLoading: verifyPasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isSendOTPLoading: sendOTPMutation.isPending,
    isVerifyOTPLoading: verifyOTPMutation.isPending,
    isResendOTPLoading: resendOTPMutation.isPending,
    isUpdateEmailLoading: updateEmailMutation.isPending,
    isUpdateUsernameLoading: updateUsernameMutation.isPending,
  };
};
