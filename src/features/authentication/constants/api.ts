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
  TEST: `/api/${AUTH_API_CONFIG.VERSION}/auth/test`,
  CHECK_EMAIL: `/api/${AUTH_API_CONFIG.VERSION}/auth/check-email`,
} as const;

// Authentication Constants
export const AUTH_CONSTANTS = {
  COOKIE_NAME: 'auth-token',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const;
