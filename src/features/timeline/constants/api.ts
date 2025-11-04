import { API_CONFIG } from '@/constants/api';

export const TIMELINE_ENDPOINTS = {
  ADD_TWEET: `/api/${API_CONFIG.VERSION}/posts`,
  TIMELINE_FEED_FOR_YOU: `/api/${API_CONFIG.VERSION}/posts/timeline/for-you`,
  TIMELINE_FEED_FLLOWING: `/api/${API_CONFIG.VERSION}/posts/timeline/following`,
} as const;

export const OPTIMISTIC_TYPES = {
  LIKE: 'like',
  REPLY: 'reply',
  FOLLOW: 'follow',
  REPOST: 'repost',
} as const;
