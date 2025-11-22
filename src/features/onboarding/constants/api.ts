// Onboarding API Configuration
export const ONBOARDING_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

// API endpoints for onboarding feature
export const ONBOARDING_ENDPOINTS = {
  UPDATE_DATE_OF_BIRTH: `/api/${ONBOARDING_API_CONFIG.VERSION}/profile/me`,
  GET_INTERESTS: `/api/${ONBOARDING_API_CONFIG.VERSION}/users/interests`,
  UPDATE_INTERESTS: `/api/${ONBOARDING_API_CONFIG.VERSION}/users/interests/me`,
  FOLLOW_USER: (userId: number) =>
    `/api/${ONBOARDING_API_CONFIG.VERSION}/users/${userId}/follow`,
  UNFOLLOW_USER: (userId: number) =>
    `/api/${ONBOARDING_API_CONFIG.VERSION}/users/${userId}/follow`,
  SUGGESTED_USERS: `/api/${ONBOARDING_API_CONFIG.VERSION}/users/suggested`,
} as const;
