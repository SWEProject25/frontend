import { TimelineFeed } from '../../timeline/types/api';

export interface Tweet {
  id: number;
  user_id: number;
  content: string;
  type: string;
  parent_id: null;
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
}

export interface TweetResponseDto {
  status: string;
  message: string;
  data: Tweet;
}

export interface Media {
  url: string;
  type: 'IMAGE' | 'VIDEO';
}
export interface Reply {
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

export interface ReplyResponseDto {
  status: string;
  message: string;
  data: TimelineFeed[];
}
