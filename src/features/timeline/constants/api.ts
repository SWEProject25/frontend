import { API_CONFIG } from '@/constants/api';

export const TIMELINE_ENDPOINTS = {
  ADD_TWEET: `/api/${API_CONFIG.VERSION}/posts`,
  TIMELINE_FEED_FOR_YOU: `/api/${API_CONFIG.VERSION}/posts/timeline/for-you`,
  TIMELINE_FEED_FLLOWING: `/api/${API_CONFIG.VERSION}/posts/timeline/following`,
  PROFILE_SEARCH: `/api/${API_CONFIG.VERSION}/profile/search`,
  HASTHAG_SEARCH: `/api/${API_CONFIG.VERSION}/posts/search/hashtag`,
} as const;

export const OPTIMISTIC_TYPES = {
  LIKE: 'like',
  REPLY: 'reply',
  FOLLOW: 'follow',
  REPOST: 'repost',
  Quote: 'repost',
  BLOCK: 'block',
  MUTE: 'mute',
  DELETE: 'delete',
} as const;

export const REAL_TIME_TWEETS_SOCKET_EVENTS = {
  JOIN_POST: 'joinPost',
  LEAVE_POST: 'leavePost',

  LIKE_UPDATE: 'likeUpdate',
  REPOST_UPDATE: 'repostUpdate',
  COMMENT_UPDATE: 'commentUpdate',

  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
};
