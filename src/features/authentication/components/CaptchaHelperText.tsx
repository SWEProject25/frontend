'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Captcha Helper Text Component
 * Displays Google privacy policy and terms of service links
 */
export function CaptchaHelperText() {
  return (
    <div className="text-center">
      <p className="text-xs text-text-secondary">
        Protected by reCAPTCHA. Google{' '}
        <Link
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Terms of Service
        </Link>{' '}
        apply.
      </p>
    </div>
  );
}
