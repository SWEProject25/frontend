import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { SendOTPDto } from '../types/api';

export function useOTPStep(email: string) {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const hasAttemptedSend = useRef(false);
  const { sendOTP } = useAuth();

  const sendOTPCode = useCallback(async () => {
    setIsSendingOTP(true);
    try {
      const otpData: SendOTPDto = { email };
      await sendOTP(otpData);
      setIsOTPSent(true);
    } catch (error) {
      console.error('OTP send failed:', error);
    } finally {
      setIsSendingOTP(false);
    }
  }, [email, sendOTP]);

  const retrySendOTP = useCallback(() => {
    hasAttemptedSend.current = false;
    setIsOTPSent(false);
    sendOTPCode();
  }, [sendOTPCode]);

  // Auto-send OTP when email is provided
  useEffect(() => {
    if (email && !hasAttemptedSend.current) {
      hasAttemptedSend.current = true;
      sendOTPCode();
    }
  }, [email, sendOTPCode]);

  return {
    isOTPSent,
    isSendingOTP,
    retrySendOTP,
  };
}
