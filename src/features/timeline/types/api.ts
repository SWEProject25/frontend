import { TWEET_QUERY_KEYS } from '@/features/tweets/hooks/tweetQueries';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { EXPLORE_QUERY_KEYS } from '@/features/explore/hooks/exploreQueries';
import { InfiniteData } from '@tanstack/react-query';
import { ReplyDto } from '@/features/tweets/types';
import { ExploreSearchFeedDtoResponse } from '@/features/explore/types/api';
import { PROFILE_QUERY_KEYS } from '@/features/profile';
export const TweetFormDataKeys = {
  CONTENT: 'content',
  TYPE: 'type',
  PARENT_ID: 'parentId',
  VISIBILITY: 'visibility',
  MEDIA: 'media',
  MENTIONS: 'mentionsIds',
};

export interface AddTweetResponse {
  status: string;
  message: string;
  data: TimelineFeed;
}
export interface Media {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}
export interface TimelineTweet {
  userId: number;
  username: string;
  verified: boolean;
  name: string;
  avatar: string | null;
  postId: number;
  date: string;
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isFollowedByMe: boolean;
  isRepostedByMe: boolean;
  isMutedByMe?: boolean;
  isBlockedByMe?: boolean;
  text: string;
  type?: string;
  parentId?: number;
  mentions: Mention[];
  media: Media[];
  isQuote?: boolean;
  originalPostData?: TimelineTweet;
  isDeleted?: boolean;
  flagReply?: boolean;
  isRepost?: boolean;
}
interface Mention {
  userId: number;
  username: string;
}

export interface TimelineFeed extends TimelineTweet {
  isRepost: boolean;
  isQuote: boolean;
  originalPostData?: TimelineTweet;
}

export interface TimelineFeedDtoResponse {
  status: string;
  message: string;
  data: {
    posts: TimelineFeed[];
  };
}

export interface Profile {
  name: string;
  User: {
    username: string;
    is_verified: boolean;
  };
  is_followed_by_me: boolean;
  user_id: number;
  profile_image_url: string;
}
export interface ProfileSearchDtoResponse {
  status: string;
  message: string;
  data: Profile[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface HashtagSearchDtoResponse {
  status: string;
  message: string;
  data: { posts: TimelineFeed[] };
  metadata: {
    hashtag: string;
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export type QueryKeyType =
  | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
  | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
  | typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU
  | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>
  | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST>
  | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP>
  | ReturnType<typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST>
  | ReturnType<typeof PROFILE_QUERY_KEYS.profilePosts>
  | ReturnType<typeof PROFILE_QUERY_KEYS.profileMedia>
  | ReturnType<typeof PROFILE_QUERY_KEYS.profileLikes>
  | ReturnType<typeof PROFILE_QUERY_KEYS.profileReplies>
  | ReturnType<typeof PROFILE_QUERY_KEYS.profileMedia>;

export type FeedType =
  | InfiniteData<TimelineFeedDtoResponse, number>
  | InfiniteData<ExploreSearchFeedDtoResponse, number>
  | InfiniteData<ReplyDto, number>;
