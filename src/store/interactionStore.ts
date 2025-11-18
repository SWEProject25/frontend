import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { InteractionStore } from '@/types/interactionTypes';

export const useInteractionStore = create<InteractionStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        followStates: new Map(),
        blockedUsers: [],
        blockedUserIds: new Set(),
        mutedUsers: [],
        mutedUserIds: new Set(),
        isLoading: false,

        // Follow actions
        setFollowState: (userId, isFollowing) => {
          set((state) => {
            const newFollowStates = new Map(state.followStates);
            newFollowStates.set(userId, isFollowing);
            return { followStates: newFollowStates };
          });
        },

        getFollowState: (userId) => {
          return get().followStates.get(userId);
        },

        clearFollowState: (userId) => {
          set((state) => {
            const newFollowStates = new Map(state.followStates);
            newFollowStates.delete(userId);
            return { followStates: newFollowStates };
          });
        },

        // Block actions
        addBlockedUser: (user) => {
          set((state) => {
            // Check if user is already blocked
            if (state.blockedUserIds.has(user.id)) {
              return state;
            }

            const newBlockedUsers = [...state.blockedUsers, user];
            const newBlockedUserIds = new Set(state.blockedUserIds);
            newBlockedUserIds.add(user.id);

            return {
              blockedUsers: newBlockedUsers,
              blockedUserIds: newBlockedUserIds,
            };
          });
        },

        removeBlockedUser: (userId) => {
          set((state) => {
            const newBlockedUsers = state.blockedUsers.filter(
              (user) => user.id !== userId
            );
            const newBlockedUserIds = new Set(state.blockedUserIds);
            newBlockedUserIds.delete(userId);

            return {
              blockedUsers: newBlockedUsers,
              blockedUserIds: newBlockedUserIds,
            };
          });
        },

        setBlockedUsers: (users) => {
          const blockedUserIds = new Set(users.map((user) => user.id));
          set({
            blockedUsers: users,
            blockedUserIds,
          });
        },

        isUserBlocked: (userId) => {
          return get().blockedUserIds.has(userId);
        },

        // Mute actions
        addMutedUser: (user) => {
          set((state) => {
            // Check if user is already muted
            if (state.mutedUserIds.has(user.id)) {
              return state;
            }

            const newMutedUsers = [...state.mutedUsers, user];
            const newMutedUserIds = new Set(state.mutedUserIds);
            newMutedUserIds.add(user.id);

            return {
              mutedUsers: newMutedUsers,
              mutedUserIds: newMutedUserIds,
            };
          });
        },

        removeMutedUser: (userId) => {
          set((state) => {
            const newMutedUsers = state.mutedUsers.filter(
              (user) => user.id !== userId
            );
            const newMutedUserIds = new Set(state.mutedUserIds);
            newMutedUserIds.delete(userId);

            return {
              mutedUsers: newMutedUsers,
              mutedUserIds: newMutedUserIds,
            };
          });
        },

        setMutedUsers: (users) => {
          const mutedUserIds = new Set(users.map((user) => user.id));
          set({
            mutedUsers: users,
            mutedUserIds,
          });
        },

        isUserMuted: (userId) => {
          return get().mutedUserIds.has(userId);
        },

        // General actions
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        clearAllStates: () => {
          set({
            followStates: new Map(),
            blockedUsers: [],
            blockedUserIds: new Set(),
            mutedUsers: [],
            mutedUserIds: new Set(),
            isLoading: false,
          });
        },
      }),
      {
        name: 'interaction-storage',
        partialize: (state) => ({
          followStates: Array.from(state.followStates.entries()),
          blockedUsers: state.blockedUsers,
          mutedUsers: state.mutedUsers,
        }),
        // Custom serialization for Map and Set
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Reconstruct Map from array
            state.followStates = new Map(
              state.followStates as unknown as [number, boolean][]
            );
            // Reconstruct Sets from arrays
            state.blockedUserIds = new Set(
              state.blockedUsers.map((user) => user.id)
            );
            state.mutedUserIds = new Set(
              state.mutedUsers.map((user) => user.id)
            );
          }
        },
      }
    )
  )
);
