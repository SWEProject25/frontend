import { TimelineFeed, TimelineTweet } from '@/features/timeline/types/api';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';
export interface TweetStore {
  currentTweet: TimelineFeed | null;
  isLoading: boolean;
  error: string | null;
  currentTimeLineFeed: TimelineFeedDtoResponse | null;
  tweetSummary: string | null;
  isSummaryOpened?: boolean;
  summaryTweet?: TimelineFeed | null;

  setCurrentTweet: (tweet: TimelineFeed | TimelineTweet | null) => void;
  setTimeLineFeed: (tweets: TimelineFeedDtoResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearTweet: () => void;
  setTweetSummary: (summary: string | null) => void;
  setSummaryOpened: (opened: boolean) => void;
  setSummaryTweet: (tweet: TimelineFeed | TimelineTweet | null) => void;
}
