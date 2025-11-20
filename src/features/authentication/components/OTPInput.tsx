'use client';

import React from 'react';
import { LoadingSpinner } from './AuthLoadingSpinner';
import { OTPEmailDisplay } from './OTPEmailDisplay';
import { OTPInputField } from './OTPInputField';
import { OTPResendButton } from './OTPResendButton';
import { useOTPStep } from '../hooks/useOTPStep';
import { useOTPInput } from '../hooks/useOTPInput';
import { useOTPResend } from '../hooks/useOTPResend';
import { OTP_CONSTANTS } from '../constants';
import { OTPInputProps } from '../types';

export function OTPInput({
  length = OTP_CONSTANTS.DEFAULT_LENGTH,
  onComplete,
  onChange,
  email,
  error,
  onClearError,
}: OTPInputProps) {
  // Use OTP step hook to handle automatic OTP sending
  const { isOTPSent, isSendingOTP, retrySendOTP } = useOTPStep(email || '');

  // Use OTP input hook for input management
  const { otp, inputRefs, handleChange, handleKeyDown, handlePaste, resetOTP } =
    useOTPInput({
      length,
      onComplete,
      onChange,
      error,
      onClearError,
    });

  // Use OTP resend hook for resend functionality
  const {
    resendCountdown,
    isResendDisabled,
    handleResendClick,
    handleCountdownComplete,
  } = useOTPResend({
    isOTPSent,
    onResend: retrySendOTP,
    onReset: resetOTP,
  });

  // Show loader while sending OTP
  if (isSendingOTP) {
    return (
      <LoadingSpinner
        title={email ? 'Sending verification code to' : undefined}
        subtitle={email}
        message="Please wait while we send your verification code..."
      />
    );
  }

  // Only show OTP input if OTP was successfully sent
  if (!isOTPSent) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Email Display */}
      {email && <OTPEmailDisplay email={email} />}

      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <OTPInputField
            key={index}
            digit={digit}
            index={index}
            error={error}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-text-inactive">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* Resend Code */}
      <div className="text-center">
        <OTPResendButton
          isDisabled={isResendDisabled}
          countdown={resendCountdown}
          onResend={handleResendClick}
          onCountdownComplete={handleCountdownComplete}
        />
      </div>
    </div>
  );
}
