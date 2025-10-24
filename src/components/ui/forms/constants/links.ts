// Form link constants
export const MODAL_LINKS = {
  LOGIN: 'modal:login',
  SIGNUP: 'modal:signup',
  CREATE_ACCOUNT: 'modal:createAccount',
} as const;

export const EXTERNAL_LINKS = {
  RESEND_OTP: 'resend-otp',
} as const;

// Footer link text constants
export const FOOTER_LINK_TEXTS = {
  DONT_HAVE_ACCOUNT: "Don't have an account?",
  HAVE_ACCOUNT: 'Have an account already?',
  ALREADY_HAVE_ACCOUNT: 'Already have an account?',
  REMEMBER_PASSWORD: 'Remember your password?',
  DIDNT_RECEIVE_CODE: "Didn't receive the code?",
} as const;

export const FOOTER_LINK_ACTIONS = {
  SIGN_UP: 'Sign up',
  LOG_IN: 'Log in',
  SIGN_IN: 'Sign in',
  RESEND: 'Resend',
} as const;
