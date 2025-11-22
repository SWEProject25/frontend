export const TweetFormDataKeys = {
  CONTENT: 'content',
  TYPE: 'type',
  PARENT_ID: 'parentId',
  VISIBILITY: 'visibility',
  MEDIA: 'media',
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
  text: string;
  media: Media[];
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
