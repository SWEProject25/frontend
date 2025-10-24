// Authentication API Configuration
export const AUTH_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  VERSION: process.env.NEXT_PUBLIC_API_VERSION,
} as const;

// Authentication API Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `/api/${AUTH_API_CONFIG.VERSION}/auth/register`,
  LOGIN: `/api/${AUTH_API_CONFIG.VERSION}/auth/login`,
  LOGOUT: `/api/${AUTH_API_CONFIG.VERSION}/auth/logout`,
  VERIFICATION_OTP: `/api/${AUTH_API_CONFIG.VERSION}/auth/verification-otp`,
  VERIFY_OTP: `/api/${AUTH_API_CONFIG.VERSION}/auth/verify-otp`,
  RESEND_OTP: `/api/${AUTH_API_CONFIG.VERSION}/auth/resend-otp`,
  TEST: `/api/${AUTH_API_CONFIG.VERSION}/auth/test`,
  CHECK_EMAIL: `/api/${AUTH_API_CONFIG.VERSION}/auth/check-email`,
  VERIFY_RECAPTCHA: `/api/${AUTH_API_CONFIG.VERSION}/auth/verify-recaptcha`,
  GOOGLE_OAUTH_LOGIN: `/api/v1.0/auth/google/login`,
  GITHUB_OAUTH_LOGIN: `/api/v1.0/auth/github/login`,
} as const;

// Authentication Constants
export const AUTH_CONSTANTS = {
  COOKIE_NAME: 'auth-token',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const;

// Client-side authentication configuration (redirects, UI)
export const AUTH_CLIENT_CONFIG = {
  SUCCESS_REDIRECT: process.env.NEXT_PUBLIC_AUTH_SUCCESS_REDIRECT || '/',
  REGISTER_REDIRECT: process.env.NEXT_PUBLIC_AUTH_REGISTER_REDIRECT || '/',
  POPUP_WIDTH: 500,
  POPUP_HEIGHT: 600,
  LEFT_MARGIN: 10,
  TOP_MARGIN: 10,
} as const;
