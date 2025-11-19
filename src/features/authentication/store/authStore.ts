import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserResponse } from '../types/api';
import { AuthStore } from '../types/store';

const PASSWORD_VERIFICATION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAuthStore = create<AuthStore>()(
  devtools((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    passwordVerifiedAt: null,

    // Actions
    setUser: (user: UserResponse) => {
      set({ user, isAuthenticated: true });
    },

    clearUser: () => {
      set({ user: null, isAuthenticated: false, passwordVerifiedAt: null });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setPasswordVerified: (verified: boolean) => {
      if (verified) {
        set({ passwordVerifiedAt: Date.now() });
      } else {
        set({ passwordVerifiedAt: null });
      }
    },

    checkPasswordVerification: () => {
      const { passwordVerifiedAt } = get();
      if (!passwordVerifiedAt) return false;

      const now = Date.now();
      const isValid = now - passwordVerifiedAt < PASSWORD_VERIFICATION_DURATION;

      // Clear verification if expired
      if (!isValid) {
        set({ passwordVerifiedAt: null });
      }

      return isValid;
    },
  }))
);
