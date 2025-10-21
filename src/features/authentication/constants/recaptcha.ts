/**
 * reCAPTCHA Configuration Constants
 */
export const RECAPTCHA_CONFIG = {
  SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  DEFAULT_THEME: 'light' as const,
  DEFAULT_SIZE: 'normal' as const,
  ERRORS: {
    EXPIRED: 'reCAPTCHA expired. Please verify again.',
    ERROR: 'reCAPTCHA error. Please try again.',
    MISSING_KEY:
      'NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured in environment variables.',
    VERIFICATION_FAILED: 'Verification failed. Please try again.',
  },
} as const;
