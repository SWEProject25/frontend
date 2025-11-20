import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { TimelineFeed } from '@/features/timeline/types/api';
import { TweetStore } from '../types/store';

export const useTweetStore = create<TweetStore>()(
  devtools(
    (set) => ({
      // State
      currentTweet: null,
      isLoading: false,
      error: null,

      // Actions
      setCurrentTweet: (tweet: TimelineFeed | null) => {
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
