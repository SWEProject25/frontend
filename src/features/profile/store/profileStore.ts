import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { UserProfile } from '../types/api';
import { ProfileStore } from '../types/store';
import { POSTS_TAB } from '../constants/tabs';

export const useProfileStore = create<ProfileStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        currentProfile: null,
        isLoading: false,
        error: null,
        selectedTab: POSTS_TAB,
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
        actions: {
          selectTab: (tab) => {
            set({ selectedTab: tab });
          },
          setBlockedFlag: (flag) =>
            set((state) =>
              state.currentProfile
                ? {
                    currentProfile: {
                      ...state.currentProfile,
                      is_blocked_by_me: flag,
                    },
                  }
                : { currentProfile: state.currentProfile }
            ),
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
export const useSelectedTab = () =>
  useProfileStore((state) => state.selectedTab);
export const useActions = () => useProfileStore((state) => state.actions);
