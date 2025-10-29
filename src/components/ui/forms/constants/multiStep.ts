import { AllSteps } from '../types/components';

// Check if verification steps should be skipped (for E2E testing or development)
const shouldSkipVerificationSteps = (): boolean => {
  return process.env.NEXT_PUBLIC_SKIP_VERIFICATION_STEPS === 'true';
};

// Multi-step form step definitions
export const LOGIN_STEPS: AllSteps[] = ['email', 'password'];

export const FORGOT_PASSWORD_STEPS: AllSteps[] = [
  'forgotPassword', // collect email
  'password', // enter new password (mapped to resetPassword config)
] as AllSteps[];

// Default create account steps (for production)
export const CREATE_ACCOUNT_STEPS: AllSteps[] = [
  'register',
  'captcha',
  'otp',
  'password',
];

// Function to get create account steps based on environment
export const getCreateAccountSteps = (): AllSteps[] => {
  if (shouldSkipVerificationSteps()) {
    // Skip captcha and OTP steps in development/E2E mode
    return ['register', 'otp', 'password'];
  }
  // Full flow for production
  return ['register', 'captcha', 'otp', 'password'];
};

// Multi-step form constants
export const MULTI_STEP_CONSTANTS = {
  LOGIN_STEPS,

  getCreateAccountSteps,
};
