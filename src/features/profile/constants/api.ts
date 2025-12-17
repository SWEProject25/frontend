import { API_CONFIG } from '@/constants/api';
export const PROFILE_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const PROFILE_ENDPOINTS = {
  GET_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  UPDATE_MY_PROFILE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me`,
  ADD_PROFILE_IMAGE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me/profile-picture`,
  ADD_BANNER_IMAGE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me/banner`,
  REMOVE_PROFILE_IMAGE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me/profile-picture`,
  REMOVE_BANNER_IMAGE: `/api/${PROFILE_API_CONFIG.VERSION}/profile/me/banner`,
  GET_PROFILE_BY_USER_ID: (userId: number) =>
    `/api/${PROFILE_API_CONFIG.VERSION}/profile/user/${userId}`,
  GET_PROFILE_BY_USERNAME: (username: string) =>
    `/api/${PROFILE_API_CONFIG.VERSION}/profile/username/${username}`,
  SEARCH_PROFILES: `/api/${PROFILE_API_CONFIG.VERSION}/profile/search`,
  PROFILE_POSTS: (user: number | string) =>
    `/api/${API_CONFIG.VERSION}/posts/profile/${user}`,
  PROFILE_REPLIES: (user: number | string) =>
    `/api/${API_CONFIG.VERSION}/posts/profile/${user}/replies`,
  PROFILE_LIKES: (user: number) =>
    `/api/${API_CONFIG.VERSION}/posts/liked/${user}`,
  PROFILE_MEDIA: (user: number | string) =>
    `/api/${API_CONFIG.VERSION}/posts/profile/${user}/media`,
  PROFILE_MENTIONS: (user: number) =>
    `/api/${API_CONFIG.VERSION}/posts/mentioned/${user}`,
} as const;

export const PROFILE_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;
