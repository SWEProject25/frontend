/**
 * Environment Variables Configuration
 *
 * Create a .env.local file in the root directory with the following variables:
 *
 * # API Configuration
 * NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
 * NEXT_PUBLIC_API_VERSION=v1.0
 *
 * # Authentication Endpoints
 * NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT=/api/v1.0/auth/register
 * NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT=/api/v1.0/auth/login
 * NEXT_PUBLIC_AUTH_TEST_ENDPOINT=/api/v1.0/auth/test
 * NEXT_PUBLIC_AUTH_CHECK_EMAIL_ENDPOINT=/api/v1.0/auth/check-email
 *
 * # App Configuration
 * NEXT_PUBLIC_APP_NAME=X Clone
 * NEXT_PUBLIC_APP_VERSION=1.0.0
 *
 * # Development Configuration
 * NODE_ENV=development
 */

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',

  // Authentication Endpoints
  AUTH_REGISTER:
    process.env.NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT || '/api/v1.0/auth/register',
  AUTH_LOGIN:
    process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT || '/api/v1.0/auth/login',
  AUTH_TEST:
    process.env.NEXT_PUBLIC_AUTH_TEST_ENDPOINT || '/api/v1.0/auth/test',
  AUTH_CHECK_EMAIL:
    process.env.NEXT_PUBLIC_AUTH_CHECK_EMAIL_ENDPOINT ||
    '/api/v1.0/auth/check-email',

  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'X Clone',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
