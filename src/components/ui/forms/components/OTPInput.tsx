'use client';

import React, { useState, useRef, useEffect } from 'react';
import { OTPInputProps } from '../types/components';
import { OTP_CONSTANTS } from '../constants';
import {
  isValidOTPInput,
  isOTPComplete,
  getNextOTPIndex,
  getPreviousOTPIndex,
  processPastedOTP,
} from '@/features/authentication/utils';

export function OTPInput({
  length = OTP_CONSTANTS.DEFAULT_LENGTH,
  onComplete,
  email,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!isValidOTPInput(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      const nextIndex = getNextOTPIndex(index, length);
      setActiveIndex(nextIndex);
      inputRefs.current[nextIndex]?.focus();
    }

    // Check if OTP is complete
    if (isOTPComplete(newOtp, length)) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
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
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    const pastedArray = processPastedOTP(pastedData, length);

    if (isOTPComplete(pastedArray, length)) {
      setOtp(pastedArray);
      onComplete(pastedData);
      setActiveIndex(length - 1);
      inputRefs.current[length - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  return (
    <div className="space-y-6">
      {/* Email Display */}
      {email && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            We sent a verification code to
          </p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>
      )}

      {/* OTP Input */}
      <div className="flex justify-center space-x-2">
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
            className={`${OTP_CONSTANTS.INPUT_SIZE} text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            maxLength={OTP_CONSTANTS.MAX_LENGTH_PER_INPUT}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* Resend Code */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Didn&apos;t receive the code? Resend
        </button>
      </div>
    </div>
  );
}
