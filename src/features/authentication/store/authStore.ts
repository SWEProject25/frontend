import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  UserResponse,
  LoginDto,
  CreateUserDto,
  SendOTPDto,
  VerifyOTPDto,
  ResendOTPDto,
} from '../types/api';
import { AuthStore } from '../types/store';
import { authApi } from '../services/authApi';

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user: UserResponse) => {
          set({ user, isAuthenticated: true, error: null });
        },

        clearUser: () => {
          set({ user: null, isAuthenticated: false, error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        login: async (credentials: LoginDto) => {
          try {
            set({ isLoading: true, error: null });

            const response = await authApi.login(credentials);

            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Invalid email or password, please try again';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        register: async (userData: CreateUserDto) => {
          try {
            set({ isLoading: true, error: null });

            const response = await authApi.register(userData);

            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Registration failed';
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true });

            await authApi.logout();

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch {
            // Even if logout fails on server, clear local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        sendOTP: async (emailData: SendOTPDto) => {
          try {
            set({ isLoading: true, error: null });

            await authApi.sendOTP(emailData);

            set({
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Failed to send OTP';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        verifyOTP: async (otpData: VerifyOTPDto) => {
          try {
            set({ isLoading: true, error: null });

            await authApi.verifyOTP(otpData);

            set({
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'OTP verification failed';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },

        resendOTP: async (emailData: ResendOTPDto) => {
          try {
            set({ isLoading: true, error: null });

            await authApi.resendOTP(emailData);

            set({
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Failed to resend OTP';
            set({
              isLoading: false,
              error: errorMessage,
            });
            throw error;
          }
        },
        oAuthLogin: (
          provider: string,
          onSuccess?: (user: UserResponse) => void
        ) => {
          set({ isLoading: true, error: null });
          authApi.oAuthLogin(provider, (user) => {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            if (onSuccess) onSuccess(user);
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
