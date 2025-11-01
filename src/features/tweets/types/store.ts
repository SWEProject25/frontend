import { TimelineFeed } from '@/features/timeline/types/api';

export interface TweetStore {
  currentTweet: TimelineFeed | null;
  isLoading: boolean;
  error: string | null;

  setCurrentTweet: (tweet: TimelineFeed | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTweet: () => void;
}
