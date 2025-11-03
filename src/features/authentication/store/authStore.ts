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
  }))
);
