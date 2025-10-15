import { LoginStep, CreateAccountStep } from '../types/components';

// Multi-step form step definitions
export const LOGIN_STEPS: LoginStep[] = ['email', 'password'];

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
} as const;
