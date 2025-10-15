import { OTP_CONSTANTS } from '@/components/ui/forms/constants';

/**
 * Validates OTP input (only single digits allowed)
 */
export const isValidOTPInput = (value: string): boolean => {
  return value.length <= OTP_CONSTANTS.MAX_LENGTH_PER_INPUT;
};

/**
 * Checks if OTP is complete
 */
export const isOTPComplete = (otp: string[], length: number): boolean => {
  return otp.every((digit) => digit !== '') && otp.length === length;
};

/**
 * Gets the next active index for OTP input
 */
export const getNextOTPIndex = (
  currentIndex: number,
  length: number
): number => {
  return currentIndex < length - 1 ? currentIndex + 1 : currentIndex;
};

/**
 * Gets the previous active index for OTP input
 */
export const getPreviousOTPIndex = (currentIndex: number): number => {
  return currentIndex > 0 ? currentIndex - 1 : currentIndex;
};

/**
 * Processes pasted OTP data
 */
export const processPastedOTP = (
  pastedData: string,
  length: number
): string[] => {
  const digits = pastedData.slice(0, length).split('');
  return Array.from({ length }, (_, i) => digits[i] || '');
};
