'use client';

import React from 'react';

/**
 * Captcha Verification Status Component
 * Shows a loading spinner while verifying with backend
 */
export function CaptchaVerifyingStatus() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-primary font-medium">Verifying ...</p>
      </div>
    </div>
  );
}
