'use client';

import React from 'react';
import { RECAPTCHA_CONFIG } from '../constants';

/**
 * Captcha Configuration Error Component
 * Displays when the reCAPTCHA site key is not configured
 */
export function CaptchaConfigError() {
  return (
    <div className="space-y-4">
      <div className="bg-error/10 p-4 rounded-lg border-2 border-error/20">
        <div className="text-center">
          <p className="text-sm text-error font-semibold">
            reCAPTCHA Configuration Error
          </p>
          <p className="text-xs text-error/80 mt-2">
            {RECAPTCHA_CONFIG.ERRORS.MISSING_KEY}
          </p>
        </div>
      </div>
    </div>
  );
}
