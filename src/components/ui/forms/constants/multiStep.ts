import { LoginStep, CreateAccountStep } from '../types/components';

// Check if verification steps should be skipped (for E2E testing or development)
const shouldSkipVerificationSteps = (): boolean => {
  return process.env.NEXT_PUBLIC_SKIP_VERIFICATION_STEPS === 'true';
};

// Multi-step form step definitions
export const LOGIN_STEPS: LoginStep[] = ['email', 'password'];

// Function to get create account steps based on environment
export const getCreateAccountSteps = (): CreateAccountStep[] => {
  if (shouldSkipVerificationSteps()) {
    // Skip captcha and OTP steps in development/E2E mode
    return ['register', 'password'];
  }
  // Full flow for production
  return ['register', 'captcha', 'otp', 'password'];
};

// Default create account steps (for production)
export const CREATE_ACCOUNT_STEPS: CreateAccountStep[] = [
  'register',
  'captcha',
  'otp',
  'password',
];

// Multi-step form constants
export const MULTI_STEP_CONSTANTS = {
  LOGIN_STEPS,
  CREATE_ACCOUNT_STEPS,
  getCreateAccountSteps,
  shouldSkipVerificationSteps,
} as const;
