import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  TimelineFeed,
  TimelineFeedDtoResponse,
} from '@/features/timeline/types/api';
import { TweetStore } from '../types/store';

export const useTweetStore = create<TweetStore>()(
  devtools((set) => ({
    // State
    currentTweet: null,
    currentTimeLineFeed: null,
    isLoading: false,
    error: null,
    tweetSummary:
      'Hello iam here to summarize tweets content for you. \nclick on the grok icon to explore any tweet you want.',
    isSummaryOpened: false,
    summaryTweet: null,

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
    setTweetSummary: (summary: string | null) => {
      set({ tweetSummary: summary });
    },
    setSummaryOpened: (opened: boolean) => {
      set({ isSummaryOpened: opened });
    },
    setSummaryTweet: (tweet: TimelineFeed | null) => {
      set({ summaryTweet: tweet });
    },
  }))
);
