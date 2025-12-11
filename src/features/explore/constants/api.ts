import { API_CONFIG } from '@/constants/api';

export const EXPLORE_ENDPOINTS = {
  EXPLORE_FEED_SEARCH_HASHTAG: `/api/${API_CONFIG.VERSION}/posts/search/hashtag`,
  EXPLORE_FEED_SEARCH_TWEETS: `/api/${API_CONFIG.VERSION}/posts/search`,
  EXPLORE_FEED_FOR_YOU: `/api/${API_CONFIG.VERSION}/posts/explore/for-you`,
  EXPLORE_FEED_INTEREST: `/api/${API_CONFIG.VERSION}/posts/timeline/explore/interests`,
  EXPLORE_FEED_TRENDING: `/api/${API_CONFIG.VERSION}/hashtags/trending`,
} as const;
