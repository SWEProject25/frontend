import { AllSteps } from '../types/components';

// Check if verification steps should be skipped (for E2E testing or development)
const shouldSkipVerificationSteps = (): boolean => {
  return process.env.NEXT_PUBLIC_SKIP_VERIFICATION_STEPS === 'true';
};

// Multi-step form step definitions
export const LOGIN_STEPS: AllSteps[] = ['email', 'password'];

export const FORGOT_PASSWORD_STEPS: AllSteps[] = [
  'forgotPassword', // collect email
  'otp', // verify code (reuse OTP component)
  'password', // enter new password (mapped to resetPassword config)
] as AllSteps[];

// Default create account steps (for production)
export const CREATE_ACCOUNT_STEPS: AllSteps[] = [
  'register',
  'captcha',
  'otp',
  'password',
];
// Helper to return forgot-password steps based on environment flag
export const getForgotPasswordSteps = (): AllSteps[] => {
  if (shouldSkipVerificationSteps()) {
    // Skip OTP step in development/E2E mode
    return ['forgotPassword', 'password'];
  }
  return FORGOT_PASSWORD_STEPS;
};

// Function to get create account steps based on environment
export const getCreateAccountSteps = (): AllSteps[] => {
  if (shouldSkipVerificationSteps()) {
    // Skip captcha and OTP steps in development/E2E mode
    return ['register', 'password'];
  }
  // Full flow for production
  return ['register', 'captcha', 'otp', 'password'];
};

// Multi-step form constants
export const MULTI_STEP_CONSTANTS = {
  LOGIN_STEPS,
  getForgotPasswordSteps,
  getCreateAccountSteps,
};
