import React from 'react';
import { GoogleIcon, AppleIcon } from '@/components/ui/icons';

// Pre-configured form configurations
const MONTHS = [
  { value: '', label: 'Month' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const DAYS = [
  { value: '', label: 'Day' },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  })),
];

const YEARS = [
  { value: '', label: 'Year' },
  ...Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
  }),
];

export const authFormConfigs = {
  login: {
    title: 'Sign in to X',
    fields: [
      {
        name: 'identifier',
        label: 'Phone, email, or username',
        type: 'text' as const,
        required: true,
      },
    ],
    submitButton: { text: 'Next' },
    socialProviders: [
      {
        id: 'google',
        name: 'Sign in with Google',
        icon: <GoogleIcon className="w-5 h-5" />,
      },
      {
        id: 'apple',
        name: 'Sign in with Apple',
        icon: <AppleIcon className="w-5 h-5" />,
      },
    ],
    footerLinks: [
      {
        text: "Don't have an account?",
        linkText: 'Sign up',
        href: '/auth/register',
      },
    ],
    showForgotPassword: true,
  },

  register: {
    title: 'Create your account',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text' as const,
        required: true,
        maxLength: 50,
        showCharCount: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email' as const,
        required: true,
      },
      {
        name: 'birthMonth',
        label: 'Month',
        type: 'select' as const,
        required: true,
        options: MONTHS,
      },
      {
        name: 'birthDay',
        label: 'Day',
        type: 'select' as const,
        required: true,
        options: DAYS,
      },
      {
        name: 'birthYear',
        label: 'Year',
        type: 'select' as const,
        required: true,
        options: YEARS,
      },
    ],
    submitButton: { text: 'Next' },
    footerLinks: [
      {
        text: 'Already have an account?',
        linkText: 'Sign in',
        href: '/auth/login',
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
        type: 'email' as const,
        required: true,
      },
    ],
    submitButton: { text: 'Send Reset Link' },
    footerLinks: [
      {
        text: 'Remember your password?',
        linkText: 'Sign in',
        href: '/auth/login',
      },
    ],
  },
} as const;
