export const LAYOUT_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const LAYOUT_ENDPOINTS = {
  GET_SUGGESTED_USERS: `/api/${LAYOUT_API_CONFIG.VERSION}/users/suggested`,
  GET_TRENDING_HASHTAGS: `/api/${LAYOUT_API_CONFIG.VERSION}/hashtags/trending`,
} as const;

export const LAYOUT_CONSTANTS = {
  DEFAULT_SUGGESTED_USERS_LIMIT: 5,
  DEFAULT_TRENDING_HASHTAGS_LIMIT: 10,
} as const;
