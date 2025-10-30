import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tweet } from '../types/api';
import { TweetStore } from '../types/store';

export const useTweetStore = create<TweetStore>()(
  persist(
    (set) => ({
      // State
      currentTweet: null,
      isLoading: false,
      error: null,

      // Actions
      setCurrentTweet: (tweet: Tweet | null) => {
        set({ currentTweet: tweet, error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearTweet: () => {
        set({ currentTweet: null, error: null, isLoading: false });
      },
    }),
    {
      name: 'tweet-storage',
      partialize: (state) => ({
        currentTweet: state.currentTweet,
      }),
    }
  )
);
