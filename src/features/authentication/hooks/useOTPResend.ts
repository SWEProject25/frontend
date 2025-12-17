import { useState, useEffect, useCallback } from 'react';
import { OTP_CONSTANTS } from '../constants';

export interface UseOTPResendProps {
  isOTPSent: boolean;
  onResend: () => void;
  onReset?: () => void;
}

export interface UseOTPResendReturn {
  resendCountdown: number;
  isResendDisabled: boolean;
  handleResendClick: () => void;
  handleCountdownComplete: () => void;
}

/**
 * Custom hook to manage OTP resend functionality
 * Handles countdown timer and resend button state
 */
export function useOTPResend({
  isOTPSent,
  onResend,
  onReset,
}: UseOTPResendProps): UseOTPResendReturn {
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  // Start countdown when OTP is successfully sent
  useEffect(() => {
    if (isOTPSent) {
      setResendCountdown(OTP_CONSTANTS.RESEND_COUNTDOWN_SECONDS);
      setIsResendDisabled(true);
    }
  }, [isOTPSent]);

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setIsResendDisabled(false);
    setResendCountdown(0);
  }, []);

  // Handle resend click
  const handleResendClick = useCallback(() => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setResendCountdown(OTP_CONSTANTS.RESEND_COUNTDOWN_SECONDS);

    // Reset OTP input and errors
    if (onReset) {
      onReset();
    }

    onResend();
  }, [isResendDisabled, onResend, onReset]);

  return {
    resendCountdown,
    isResendDisabled,
    handleResendClick,
    handleCountdownComplete,
  };
}
