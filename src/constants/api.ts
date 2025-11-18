export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION,
} as const;

export const FOLLOW_API_ENDPOINTS = {
  GET_FOLLOWERS: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/follows/${userId}/followers`,
  GET_FOLLOWING: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/follows/${userId}/following`,
  FOLLOW_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/follow`,
  UNFOLLOW_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/follow`,
} as const;

export const BLOCK_API_ENDPOINTS = {
  BLOCK_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/block`,
  UNBLOCK_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/block`,
  GET_BLOCKED_USERS: `/api/${API_CONFIG.VERSION}/blocks`,
} as const;

export const MUTE_API_ENDPOINTS = {
  MUTE_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/mute`,
  UNMUTE_USER: (userId: number) =>
    `/api/${API_CONFIG.VERSION}/users/${userId}/mute`,
  GET_MUTED_USERS: `/api/${API_CONFIG.VERSION}/mutes`,
} as const;
