import { useState, useRef, useEffect, useCallback } from 'react';
import {
  isValidOTPInput,
  isOTPComplete,
  getNextOTPIndex,
  getPreviousOTPIndex,
  processPastedOTP,
} from '../utils';

export interface UseOTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  error?: string;
  onClearError?: () => void;
}

export interface UseOTPInputReturn {
  otp: string[];
  activeIndex: number;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (index: number, e: React.KeyboardEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  resetOTP: () => void;
}

/**
 * Custom hook to manage OTP input logic
 * Handles state, validation, and user interactions
 */
export function useOTPInput({
  length,
  onComplete,
  error,
  onClearError,
}: UseOTPInputProps): UseOTPInputReturn {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus on active input
  useEffect(() => {
    inputRefs.current[activeIndex]?.focus();
  }, [activeIndex]);

  const handleChange = useCallback(
    (index: number, value: string) => {
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
    },
    [otp, length, error, onClearError, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
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
    },
    [otp, error, onClearError]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
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
    },
    [length, error, onClearError, onComplete]
  );

  const resetOTP = useCallback(() => {
    setOtp(new Array(length).fill(''));
    setActiveIndex(0);
    if (onClearError) {
      onClearError();
    }
  }, [length, onClearError]);

  return {
    otp,
    activeIndex,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOTP,
  };
}
