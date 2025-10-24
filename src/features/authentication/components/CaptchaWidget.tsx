'use client';

import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_CONFIG } from '../constants';

export interface CaptchaWidgetProps {
  recaptchaRef: React.RefObject<ReCAPTCHA | null>;
  siteKey: string;
  onChange: (token: string | null) => void;
  onExpired: () => void;
  onErrored: () => void;
  onLoad: () => void;
}

/**
 * reCAPTCHA Widget Component
 * Renders the Google reCAPTCHA checkbox
 */
export function CaptchaWidget({
  recaptchaRef,
  siteKey,
  onChange,
  onExpired,
  onErrored,
  onLoad,
}: CaptchaWidgetProps) {
  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={siteKey}
      onChange={onChange}
      onExpired={onExpired}
      onErrored={onErrored}
      asyncScriptOnLoad={onLoad}
      theme={RECAPTCHA_CONFIG.DEFAULT_THEME}
      size="normal"
    />
  );
}
