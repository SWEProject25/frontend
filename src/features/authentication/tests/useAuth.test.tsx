import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { server } from '@/mocks/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAuth,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  authKeys,
} from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { mockAuthUser } from '../mocks/mockAuthData';
import { authErrorHandlers } from '../mocks/handlers';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'QueryClientWrapper';

  return Wrapper;
};

describe('useAuth hooks', () => {
  beforeEach(() => {
    // Reset auth store
    const state = useAuthStore.getState();
    state.clearUser();
    state.setLoading(false);

    // Reset MSW handlers
    server.resetHandlers();
  });

  describe('authKeys', () => {
    it('should have correct query keys structure', () => {
      expect(authKeys.all).toEqual(['auth']);
      expect(authKeys.user()).toEqual(['auth', 'user']);
    });
  });

  describe('useLoginMutation', () => {
    it('should successfully login a user', async () => {
      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate({
          email: 'test@example.com',
          password: 'Password123!',
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockAuthUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle login error', async () => {
      server.use(authErrorHandlers.loginUnauthorized);

      const { result } = renderHook(() => useLoginMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      const state = useAuthStore.getState();
      expect(result.current.error).toBeTruthy();
      expect(state.user).toBeNull();
    });

    it('should update query cache on successful login', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useLoginMutation(), { wrapper });

      await waitFor(() => {
        result.current.mutate({
          email: 'test@example.com',
          password: 'Password123!',
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const cachedUser = queryClient.getQueryData(authKeys.user());
      expect(cachedUser).toEqual(mockAuthUser);
    });
  });

  describe('useRegisterMutation', () => {
    it('should successfully register a user', async () => {
      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        birthDate: '1990-01-01',
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const state = useAuthStore.getState();
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe('test@example.com');
      // After registration, onboarding should be incomplete
      expect(state.user?.onboardingStatus?.hasCompletedBirthDate).toBe(false);
      expect(state.user?.onboardingStatus?.hasCompeletedInterests).toBe(false);
      expect(state.user?.onboardingStatus?.hasCompeletedFollowing).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle registration error for existing user', async () => {
      server.use(authErrorHandlers.registerConflict);

      const { result } = renderHook(() => useRegisterMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123!',
        birthDate: '1990-01-01',
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      const state = useAuthStore.getState();
      expect(result.current.error).toBeTruthy();
      expect(state.user).toBeNull();
    });
  });

  describe('useLogoutMutation', () => {
    it('should successfully logout a user', async () => {
      // First set a user
      const { setUser } = useAuthStore.getState();
      setUser(mockAuthUser);

      const { result } = renderHook(() => useLogoutMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should clear user state even if logout API fails', async () => {
      server.use(authErrorHandlers.logoutError);

      // First set a user
      const { setUser } = useAuthStore.getState();
      setUser(mockAuthUser);

      const { result } = renderHook(() => useLogoutMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Should still clear user even on error
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('useAuth', () => {
    it('should provide auth state and mutations', () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('oAuthLogin');
      expect(result.current).toHaveProperty('isLoginLoading');
      expect(result.current).toHaveProperty('isRegisterLoading');
      expect(result.current).toHaveProperty('isLogoutLoading');
    });

    it('should reflect auth store state', () => {
      // Set user in store
      const { setUser } = useAuthStore.getState();
      setUser(mockAuthUser);

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toEqual(mockAuthUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should provide login function that works', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await result.current.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockAuthUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should provide register function that works', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        birthDate: '1990-01-01',
      });

      const state = useAuthStore.getState();
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe('test@example.com');
      // After registration, onboarding should be incomplete
      expect(state.user?.onboardingStatus?.hasCompletedBirthDate).toBe(false);
      expect(state.user?.onboardingStatus?.hasCompeletedInterests).toBe(false);
      expect(state.user?.onboardingStatus?.hasCompeletedFollowing).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should track loading states correctly', async () => {
      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      // Initially not loading
      expect(result.current.isLoginLoading).toBe(false);

      // Call login
      const loginPromise = result.current.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      // Wait for login to complete
      await loginPromise;

      // After completion, should not be loading
      await waitFor(() => expect(result.current.isLoginLoading).toBe(false));
    });
  });
});
