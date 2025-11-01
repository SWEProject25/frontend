import { API_CONFIG } from '@/constants/api';

export const TIMELINE_ENDPOINTS = {
  ADD_TWEET: `/api/${API_CONFIG.VERSION}/posts`,
  TIMELINE_FEED_FOR_YOU: `/api/${API_CONFIG.VERSION}/posts/timeline/for-you`,
} as const;
