/**
 * Google reCAPTCHA Configuration
 *
 * This file contains configuration for Google reCAPTCHA v2 integration.
 * The site key is loaded from environment variables.
 *
 * @see https://developers.google.com/recaptcha/docs/display
 */

export const RECAPTCHA_CONFIG = {
  /**
   * Get the reCAPTCHA site key from environment variables
   * This key is safe to expose in client-side code
   */
  SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,

  /**
   * reCAPTCHA theme options
   */
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
  } as const,

  /**
   * reCAPTCHA size options
   */
  SIZE: {
    NORMAL: 'normal',
    COMPACT: 'compact',
    INVISIBLE: 'invisible',
  } as const,

  /**
   * Default theme for reCAPTCHA widget
   */
  DEFAULT_THEME: 'light' as const,

  /**
   * Default size for reCAPTCHA widget
   */
  DEFAULT_SIZE: 'normal' as const,

  /**
   * Error messages
   */
  ERRORS: {
    NO_SITE_KEY: 'reCAPTCHA site key is not configured',
    VERIFICATION_FAILED: 'reCAPTCHA verification failed',
    EXPIRED: 'reCAPTCHA expired. Please verify again.',
    ERROR: 'reCAPTCHA error. Please try again.',
  } as const,
} as const;

export type RecaptchaTheme =
  (typeof RECAPTCHA_CONFIG.THEME)[keyof typeof RECAPTCHA_CONFIG.THEME];
export type RecaptchaSize =
  (typeof RECAPTCHA_CONFIG.SIZE)[keyof typeof RECAPTCHA_CONFIG.SIZE];
