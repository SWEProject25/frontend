'use client';

import React from 'react';
import { Countdown } from './Countdown';

export interface OTPResendButtonProps {
  isDisabled: boolean;
  countdown: number;
  onResend: () => void;
  onCountdownComplete: () => void;
}

/**
 * OTP Resend button with countdown timer
 */
export function OTPResendButton({
  isDisabled,
  countdown,
  onResend,
  onCountdownComplete,
}: OTPResendButtonProps) {
  if (isDisabled) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-text-secondary">
          Resend available in{' '}
          <Countdown
            initialSeconds={countdown}
            onComplete={onCountdownComplete}
            className="font-mono text-primary"
          />
        </p>
        <button
          type="button"
          disabled
          className="text-sm text-text-inactive cursor-not-allowed"
          data-testid="otp-resend-button-disabled"
        >
          Didn&apos;t receive the code? Resend
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onResend}
      className="text-sm text-primary hover:text-primary-hover underline transition-colors"
      data-testid="otp-resend-button"
    >
      Didn&apos;t receive the code? Resend
    </button>
  );
}
