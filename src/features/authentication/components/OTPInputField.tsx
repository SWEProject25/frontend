'use client';

import React from 'react';
import { OTP_CONSTANTS } from '../constants';
import { getOTPInputClassName } from '../utils/otpStyleUtils';

export interface OTPInputFieldProps {
  digit: string;
  index: number;
  error?: string;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

/**
 * Individual OTP input field
 */
export function OTPInputField({
  digit,
  index,
  error,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
}: OTPInputFieldProps) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={digit}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      className={getOTPInputClassName(
        OTP_CONSTANTS.INPUT_SIZE,
        !!error,
        !!digit
      )}
      maxLength={OTP_CONSTANTS.MAX_LENGTH_PER_INPUT}
      aria-label={`OTP digit ${index + 1}`}
      data-testid={`otp-input-${index + 1}`}
    />
  );
}
