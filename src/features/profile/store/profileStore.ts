import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { UserProfile } from '../types/api';
import { ProfileStore } from '../types/store';

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        currentProfile: null,
        isLoading: false,
        error: null,

        // Actions
        setCurrentProfile: (profile: UserProfile | null) => {
          set({ currentProfile: profile, error: null });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearProfile: () => {
          set({ currentProfile: null, error: null, isLoading: false });
        },
      }),
      {
        name: 'profile-storage',
        partialize: (state) => ({
          currentProfile: state.currentProfile,
        }),
      }
    )
  )
);
