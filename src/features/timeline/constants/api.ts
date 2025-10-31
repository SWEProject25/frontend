import { API_CONFIG } from '@/constants/api';

export const TIMELINE_ENDPOINTS = {
  ADD_TWEET: `/api/${API_CONFIG.VERSION}/posts`,
} as const;
