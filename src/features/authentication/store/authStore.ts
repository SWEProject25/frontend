import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserResponse } from '../types/api';
import { AuthStore } from '../types/store';

export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,

    // Actions
    setUser: (user: UserResponse) => {
      set({ user, isAuthenticated: true });
    },

    clearUser: () => {
      set({ user: null, isAuthenticated: false });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },
  }))
);
