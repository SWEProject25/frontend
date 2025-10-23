'use client';

import React from 'react';
import { LoadingSpinner } from './AuthLoadingSpinner';
import { CaptchaWidget } from './CaptchaWidget';
import { CaptchaVerifyingStatus } from './CaptchaVerifyingStatus';
import { CaptchaError } from './CaptchaError';
import { CaptchaHelperText } from './CaptchaHelperText';
import { CaptchaConfigError } from './CaptchaConfigError';
import { useCaptcha } from '../hooks/useCaptcha';
import { CaptchaInputProps } from '../types/components';

export function CaptchaInput({ onVerify }: CaptchaInputProps) {
  const {
    recaptchaRef,
    isClient,
    isVerifying,
    isRecaptchaLoaded,
    error,
    siteKey,
    handleCaptchaChange,
    handleCaptchaLoad,
    handleCaptchaExpired,
    handleCaptchaError,
  } = useCaptcha({ onVerify });

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <LoadingSpinner
        title="Loading security verification"
        message="Please wait while we load the verification widget..."
      />
    );
  }

  // Check if site key is configured
  if (!siteKey) {
    return <CaptchaConfigError />;
  }

  return (
    <div className="space-y-4">
      {/* reCAPTCHA Widget - Checkbox Version */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Loading State - Show while reCAPTCHA is loading */}
        {!isRecaptchaLoaded && (
          <LoadingSpinner
            title="Loading security verification"
            message="Please wait while we load the verification widget..."
          />
        )}

        {/* reCAPTCHA Widget - Hidden until loaded */}
        <div className={isRecaptchaLoaded ? 'block min-h-[78px]' : 'hidden'}>
          <CaptchaWidget
            recaptchaRef={recaptchaRef}
            siteKey={siteKey}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
            onErrored={handleCaptchaError}
            onLoad={handleCaptchaLoad}
          />
        </div>
      </div>

      {/* Verification Status */}
      {isVerifying && <CaptchaVerifyingStatus />}

      {/* Error Message */}
      {error && !isVerifying && <CaptchaError message={error} />}

      {/* Helper Text */}
      <CaptchaHelperText />
    </div>
  );
}
