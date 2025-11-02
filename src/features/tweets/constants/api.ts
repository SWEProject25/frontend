export const TWEET_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const TWEET_ENDPOINTS = {
  GET_TWEET_BY_ID: (tweetId: number) =>
    `/api/${TWEET_API_CONFIG.VERSION}/posts/${tweetId}`,
} as const;

export const TWEET_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;
