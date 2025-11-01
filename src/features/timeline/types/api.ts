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
  data: {
    id: number;
    user_id: number;
    content: string;
    type: string;
    parent_id: number;
    visibility: string;
    created_at: string;
    is_deleted: boolean;
    _count: {
      likes: number;
      repostedBy: number;
      Replies: number;
    };
    User: {
      id: number;
      username: string;
    };
    media: [
      {
        media_url: string;
        type: string;
      },
    ];
  };
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
