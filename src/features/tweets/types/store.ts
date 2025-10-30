import { Tweet } from './api';

export interface TweetStore {
  currentTweet: Tweet | null;
  isLoading: boolean;
  error: string | null;

  setCurrentTweet: (tweet: Tweet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTweet: () => void;
}
