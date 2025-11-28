import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  TimelineFeed,
  TimelineFeedDtoResponse,
} from '@/features/timeline/types/api';
import { TweetStore } from '../types/store';
import { get } from 'https';
import { getTweetDropdownItems } from '../constants/dropdown';

export const useTweetStore = create<TweetStore>()(
  devtools(
    (set) => ({
      // State
      currentTweet: null,
      currentTimeLineFeed: null,
      isLoading: false,
      error: null,

      // Actions
      setCurrentTweet: (tweet: TimelineFeed | null) => {
        set({ currentTweet: tweet, error: null });
      },

      setTimeLineFeed: (tweets: TimelineFeedDtoResponse | null) => {
        set({ currentTimeLineFeed: tweets, error: null });
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
    })
    // {
    //   name: 'tweet-storage',
    //   partialize: (state: any) => ({
    //     currentTweet: state.currentTweet,
    //   }),
    // }
  )
);
