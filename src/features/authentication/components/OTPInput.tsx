'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Countdown } from './Countdown';
import { useOTPStep } from '../hooks/useOTPStep';
import { OTP_CONSTANTS } from '../constants';
import { OTPInputProps } from '../types';
import {
  isValidOTPInput,
  isOTPComplete,
  getNextOTPIndex,
  getPreviousOTPIndex,
  processPastedOTP,
} from '../utils';

export function OTPInput({
  length = OTP_CONSTANTS.DEFAULT_LENGTH,
  onComplete,
  email,
  error,
  onClearError,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Use OTP step hook to handle automatic OTP sending
  const { isOTPSent, isSendingOTP, retrySendOTP } = useOTPStep(email || '');

  // Start countdown when OTP is successfully sent
  useEffect(() => {
    if (isOTPSent) {
      setResendCountdown(60); // 1 minute countdown
      setIsResendDisabled(true);
    }
  }, [isOTPSent]);

  // Handle countdown completion
  const handleCountdownComplete = () => {
    setIsResendDisabled(false);
    setResendCountdown(0);
  };

  // Handle resend click
  const handleResendClick = async () => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setResendCountdown(60);

    try {
      retrySendOTP();
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!isValidOTPInput(value)) return;

    // Clear error when user starts typing
    if (error && onClearError) {
      onClearError();
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      const nextIndex = getNextOTPIndex(index, length);
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }

    // If OTP is complete, pass it to onComplete
    if (isOTPComplete(newOtp, length)) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      // Clear error when user starts editing (backspace)
      if (error && onClearError) {
        onClearError();
      }

      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        const prevIndex = getPreviousOTPIndex(index);
        setActiveIndex(prevIndex);
        inputRefs.current[prevIndex]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    // Clear error when user pastes
    if (error && onClearError) {
      onClearError();
    }

    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const pastedArray = processPastedOTP(pastedData, length);

    if (isOTPComplete(pastedArray, length)) {
      setOtp(pastedArray);
      setActiveIndex(length - 1);
      inputRefs.current[length - 1]?.focus();
      onComplete(pastedData);
    }
  };

  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  // Show loader while sending OTP
  if (isSendingOTP) {
    return (
      <div className="space-y-6">
        {/* Email Display */}
        {email && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sending verification code to
            </p>
            <p className="font-medium text-gray-900 dark:text-white">{email}</p>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we send your verification code...
          </p>
        </div>
      </div>
    );
  }

  // Only show OTP input if OTP was successfully sent
  if (!isOTPSent) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Email Display */}
      {email && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We sent a verification code to
          </p>
          <p className="font-medium text-gray-900 dark:text-white">{email}</p>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center space-x-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`${OTP_CONSTANTS.INPUT_SIZE} text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              error
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 focus:ring-red-500 focus:border-red-500'
                : digit
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 focus:ring-blue-500'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500'
            }`}
            maxLength={OTP_CONSTANTS.MAX_LENGTH_PER_INPUT}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* Resend Code */}
      <div className="text-center">
        {isResendDisabled ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend available in{' '}
              <Countdown
                initialSeconds={resendCountdown}
                onComplete={handleCountdownComplete}
                className="font-mono text-blue-500 dark:text-blue-400"
              />
            </p>
            <button
              type="button"
              disabled
              className="text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
            >
              Didn&apos;t receive the code? Resend
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
          >
            Didn&apos;t receive the code? Resend
          </button>
        )}
      </div>
    </div>
  );
}
