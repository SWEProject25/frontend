export const PROFILE_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const PROFILE_ENDPOINTS = {
  GET_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  UPDATE_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  GET_PROFILE_BY_USER_ID: (userId: number) =>
    `/api/${PROFILE_API_CONFIG.VERSION}/profile/user/${userId}`,
  GET_PROFILE_BY_USERNAME: (username: string) =>
    `/api/${PROFILE_API_CONFIG.VERSION}/profile/username/${username}`,
  SEARCH_PROFILES: `/api/${PROFILE_API_CONFIG.VERSION}/profile/search`,
} as const;

export const PROFILE_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;
