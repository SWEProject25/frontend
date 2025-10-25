import {
  DAYS,
  FIELD_TYPES,
  FOOTER_LINK_ACTIONS,
  FOOTER_LINK_TEXTS,
  MODAL_LINKS,
  MONTHS,
  YEARS,
} from '@/components/ui/forms/constants';
import { GitHubIcon, GoogleIcon } from '@/components/ui/icons';
import { SOCIAL_PROVIDERS } from '../constants';
import { AUTH_ENDPOINTS } from '../constants/api';

export const authFormConfigs = {
  login: {
    title: 'Sign in to X',
    fields: [
      {
        name: 'identifier',
        label: 'Phone, email, or username',
        type: FIELD_TYPES.TEXT,
        required: true,
      },
    ],
    submitButton: { text: 'Next' },
    socialProviders: [
      {
        id: SOCIAL_PROVIDERS.GOOGLE,
        name: 'Sign in with Google',
        icon: <GoogleIcon className="w-5 h-5" />,
      },
      {
        id: SOCIAL_PROVIDERS.GITHUB,
        name: 'Sign in with GitHub',
        icon: <GitHubIcon className="w-5 h-5" />,
      },
    ],
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.DONT_HAVE_ACCOUNT,
        linkText: FOOTER_LINK_ACTIONS.SIGN_UP,
        href: MODAL_LINKS.SIGNUP,
      },
    ],
    showForgotPassword: true,
  },

  loginPassword: {
    title: 'Enter your password',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: FIELD_TYPES.EMAIL,
        required: true,
        disabled: true,
      },
      {
        name: 'password',
        label: 'Password',
        type: FIELD_TYPES.PASSWORD,
        required: true,
        showPasswordToggle: true,
      },
    ],
    submitButton: { text: 'Log in' },
    footerLinks: [
      {
        text: "Don't have an account?",
        linkText: 'Sign up',
        href: 'modal:signup',
      },
    ],
    showForgotPassword: true,
  },

  signup: {
    title: 'Join X today',
    fields: [],
    socialProviders: [
      {
        id: SOCIAL_PROVIDERS.GOOGLE,
        name: 'Sign up with Google',
        icon: <GoogleIcon className="w-5 h-5" />,
      },
      {
        id: SOCIAL_PROVIDERS.GITHUB,
        name: 'Sign up with GitHub',
        icon: <GitHubIcon className="w-5 h-5" />,
      },
    ],
    submitButton: { text: 'Create account' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.HAVE_ACCOUNT,
        linkText: FOOTER_LINK_ACTIONS.LOG_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },

  register: {
    title: 'Create your account',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: FIELD_TYPES.TEXT,
        required: true,
        maxLength: 50,
        showCharCount: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: FIELD_TYPES.EMAIL,
        required: true,
        // Email validation configuration for create account
        validation: {
          enableRealTimeValidation: true,
          apiEndpoint: AUTH_ENDPOINTS.CHECK_EMAIL,
          messages: {
            invalidFormat: 'Please enter a valid email.',
            alreadyTaken: 'Email has already been taken.',
          },
        },
      },
      {
        name: 'birthMonth',
        label: 'Month',
        type: FIELD_TYPES.SELECT,
        required: true,
        options: MONTHS,
        group: {
          id: 'dateOfBirth',
          title: 'Date of birth',
          description:
            'This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.',
          layout: 'horizontal',
        },
      },
      {
        name: 'birthDay',
        label: 'Day',
        type: FIELD_TYPES.SELECT,
        required: true,
        options: DAYS,
        group: {
          id: 'dateOfBirth',
          title: 'Date of birth',
          description:
            'This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.',
          layout: 'horizontal',
        },
      },
      {
        name: 'birthYear',
        label: 'Year',
        type: FIELD_TYPES.SELECT,
        required: true,
        options: YEARS,
        group: {
          id: 'dateOfBirth',
          title: 'Date of birth',
          description:
            'This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.',
          layout: 'horizontal',
        },
      },
    ],
    submitButton: { text: 'Next' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.ALREADY_HAVE_ACCOUNT,
        linkText: FOOTER_LINK_ACTIONS.SIGN_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },

  // Step 2: Captcha
  captcha: {
    title: "Verify you're human",
    subtitle: 'Complete the security check to continue',
    fields: [
      {
        name: 'captcha',
        label: 'Security Check',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter the code shown above',
      },
    ],
    submitButton: { text: 'Next' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.ALREADY_HAVE_ACCOUNT,
        linkText: FOOTER_LINK_ACTIONS.SIGN_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },

  // Step 3: OTP Verification
  otp: {
    title: 'Verify your email',
    subtitle: 'We sent a verification code to your email',
    fields: [
      {
        name: 'otp',
        label: 'Verification Code',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'Enter 6-digit code',
        maxLength: 6,
        showCharCount: true,
      },
    ],
    submitButton: { text: 'Verify Email' },
    footerLinks: [],
  },

  // Step 4: Password Setup
  password: {
    title: 'Create a password',
    subtitle: 'Choose a strong password to secure your account',
    fields: [
      {
        name: 'password',
        label: 'Password',
        type: FIELD_TYPES.PASSWORD,
        required: true,
        showPasswordToggle: true,
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: FIELD_TYPES.PASSWORD,
        required: true,
        showPasswordToggle: true,
      },
    ],
    submitButton: { text: 'Create Account' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.ALREADY_HAVE_ACCOUNT,
        linkText: FOOTER_LINK_ACTIONS.SIGN_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },

  // Reset password (used by forgot password flow)
  resetPassword: {
    title: 'Reset your password',
    subtitle: 'Enter a new password to secure your account',
    fields: [
      {
        name: 'password',
        label: 'New password',
        type: FIELD_TYPES.PASSWORD,
        required: true,
        showPasswordToggle: true,
      },
      {
        name: 'confirmPassword',
        label: 'Confirm new password',
        type: FIELD_TYPES.PASSWORD,
        required: true,
        showPasswordToggle: true,
      },
    ],
    submitButton: { text: 'Reset Password' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.REMEMBER_PASSWORD,
        linkText: FOOTER_LINK_ACTIONS.SIGN_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },

  forgotPassword: {
    title: 'Reset your password',
    subtitle: 'Enter your email to receive a password reset link',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: FIELD_TYPES.EMAIL,
        required: true,
      },
    ],
    submitButton: { text: 'Send Link' },
    footerLinks: [
      {
        text: FOOTER_LINK_TEXTS.REMEMBER_PASSWORD,
        linkText: FOOTER_LINK_ACTIONS.SIGN_IN,
        href: MODAL_LINKS.LOGIN,
      },
    ],
  },
} as const;
