import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Login Mutation
export const useLoginMutation = () => {
  const { setUser, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
    onError: (error) => {
      setError(
        error instanceof Error
          ? error.message
          : 'Invalid email or password, please try again'
      );
    },
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  const { setUser, setError } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.data.user);
      queryClient.setQueryData(authKeys.user(), data.data.user);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Registration failed');
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const { clearUser } = useAuthStore();
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

// Custom hook for authentication state
export const useAuth = () => {
  const authStore = useAuthStore();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  return {
    ...authStore,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    oAuthLogin: authStore.oAuthLogin,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
};
