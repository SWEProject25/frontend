import React from 'react';
import { GoogleIcon, GitHubIcon } from '@/components/ui/icons';
import { MONTHS, DAYS, YEARS, FIELD_TYPES } from '../constants';
import { SOCIAL_PROVIDERS } from '@/features/authentication/constants';

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
        text: 'Have an account already?',
        linkText: 'Log in',
        href: 'modal:login',
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
        text: 'Already have an account?',
        linkText: 'Sign in',
        href: 'modal:login',
      },
    ],
  },

  forgotPassword: {
    title: 'Reset your password',
    subtitle: 'Enter your email to receive reset instructions',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: FIELD_TYPES.EMAIL,
        required: true,
      },
    ],
    submitButton: { text: 'Send Reset Link' },
    footerLinks: [
      {
        text: 'Remember your password?',
        linkText: 'Sign in',
        href: 'modal:login',
      },
    ],
  },
} as const;
