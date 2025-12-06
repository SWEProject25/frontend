export const TWEET_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const TWEET_ENDPOINTS = {
  GET_TWEET_BY_ID: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}`,
  TOGGLE_LIKE_TWEET: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}/like`,
  TOGGLE_REPOST_TWEET: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}/repost`,
  GET_REPLIES_BY_TWEET_ID: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}/replies`,
  GET_TWEET_SUMMARY: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/summary/${tweetId}`,
  DELETE_TWEET: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}`,
} as const;

export const TWEET_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 2,
} as const;
