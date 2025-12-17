import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { SendOTPDto, ResendOTPDto } from '../types/api';

export function useOTPStep(email: string) {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const hasAttemptedSend = useRef(false);
  const { sendOTP, resendOTP } = useAuth();

  const sendOTPCode = useCallback(async () => {
    setIsSendingOTP(true);
    try {
      const otpData: SendOTPDto = { email };
      await sendOTP(otpData);
      setIsOTPSent(true);
    } catch (error) {
      // Silently handle error - component can check isOTPSent state
      console.error('Failed to send OTP:', error);
    } finally {
      setIsSendingOTP(false);
    }
  }, [email, sendOTP]);

  const retrySendOTP = useCallback(async () => {
    setIsSendingOTP(true);
    try {
      const resendData: ResendOTPDto = { email };
      await resendOTP(resendData);
      setIsOTPSent(true);
    } catch (error) {
      // Silently handle error - component can check isOTPSent state
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsSendingOTP(false);
    }
  }, [email, resendOTP]);

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
