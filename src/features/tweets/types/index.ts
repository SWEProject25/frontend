export * from './api';
export * from './store';

// Tweet component types
export type TweetActions = {
  replies: number;
  retweets: number;
  likes: number;
  bookmarks: number;
  views: string;
  booked: boolean;
  liked: boolean;
  reposted: boolean;
};

export type MediaItem = {
  url: string;
  type: string | 'image' | 'video';
};

export type TweetContent = {
  text?: string;
  media?: MediaItem[];
};

export type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
};

export type TweetData = {
  id: string;
  content: TweetContent;
  user: User;
  time: Date;
  Actions: TweetActions;
};
