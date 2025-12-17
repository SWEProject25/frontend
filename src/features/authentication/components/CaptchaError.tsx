'use client';

import React from 'react';

export interface CaptchaErrorProps {
  message: string;
}

/**
 * Captcha Error Message Component
 * Displays error messages for reCAPTCHA verification
 */
export function CaptchaError({ message }: CaptchaErrorProps) {
  return (
    <div className="text-center">
      <p className="text-sm text-error font-medium">{message}</p>
    </div>
  );
}
