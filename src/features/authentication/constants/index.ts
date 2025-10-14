// Authentication feature constants
export const FOOTER_LINKS = [
  'About',
  'Download the X app',
  'Grok',
  'Help Center',
  'Terms of Service',
  'Privacy Policy',
  'Cookie Policy',
  'Accessibility',
  'Ads Info',
  'Blog',
  'Careers',
  'Brand Resources',
  'Advertising',
  'Marketing',
  'X for Business',
  'Developers',
  'Directory',
  'Settings',
] as const;

// Authentication modal types
export const AUTH_MODAL_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  CREATE_ACCOUNT: 'createAccount',
} as const;

export type AuthModalType =
  (typeof AUTH_MODAL_TYPES)[keyof typeof AUTH_MODAL_TYPES];

// Social login providers
export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 710,
} as const;
