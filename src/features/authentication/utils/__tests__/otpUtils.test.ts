import { describe, it, expect } from 'vitest';
import {
  isValidOTPInput,
  isOTPComplete,
  getNextOTPIndex,
  getPreviousOTPIndex,
  processPastedOTP,
} from '../otpUtils';

describe('otpUtils', () => {
  describe('isValidOTPInput', () => {
    it('should return true for empty string', () => {
      expect(isValidOTPInput('')).toBe(true);
    });

    it('should return true for single digit', () => {
      expect(isValidOTPInput('5')).toBe(true);
    });

    it('should return false for multiple digits', () => {
      expect(isValidOTPInput('12')).toBe(false);
    });

    it('should return false for long strings', () => {
      expect(isValidOTPInput('123456')).toBe(false);
    });

    it('should return true for single character (letter)', () => {
      expect(isValidOTPInput('a')).toBe(true);
    });

    it('should return true for single special character', () => {
      expect(isValidOTPInput('!')).toBe(true);
    });
  });

  describe('isOTPComplete', () => {
    it('should return true when all digits are filled', () => {
      const otp = ['1', '2', '3', '4', '5', '6'];
      expect(isOTPComplete(otp, 6)).toBe(true);
    });

    it('should return false when some digits are empty', () => {
      const otp = ['1', '2', '', '4', '5', '6'];
      expect(isOTPComplete(otp, 6)).toBe(false);
    });

    it('should return false when all digits are empty', () => {
      const otp = ['', '', '', '', '', ''];
      expect(isOTPComplete(otp, 6)).toBe(false);
    });

    it('should return false when OTP length does not match expected length', () => {
      const otp = ['1', '2', '3', '4'];
      expect(isOTPComplete(otp, 6)).toBe(false);
    });

    it('should return true for 4-digit complete OTP', () => {
      const otp = ['1', '2', '3', '4'];
      expect(isOTPComplete(otp, 4)).toBe(true);
    });

    it('should return false when first digit is empty', () => {
      const otp = ['', '2', '3', '4', '5', '6'];
      expect(isOTPComplete(otp, 6)).toBe(false);
    });

    it('should return false when last digit is empty', () => {
      const otp = ['1', '2', '3', '4', '5', ''];
      expect(isOTPComplete(otp, 6)).toBe(false);
    });

    it('should handle single digit OTP', () => {
      expect(isOTPComplete(['5'], 1)).toBe(true);
      expect(isOTPComplete([''], 1)).toBe(false);
    });
  });

  describe('getNextOTPIndex', () => {
    it('should return next index when not at end', () => {
      expect(getNextOTPIndex(0, 6)).toBe(1);
      expect(getNextOTPIndex(2, 6)).toBe(3);
      expect(getNextOTPIndex(4, 6)).toBe(5);
    });

    it('should stay at current index when at end', () => {
      expect(getNextOTPIndex(5, 6)).toBe(5);
    });

    it('should handle single digit OTP', () => {
      expect(getNextOTPIndex(0, 1)).toBe(0);
    });

    it('should handle 4-digit OTP', () => {
      expect(getNextOTPIndex(0, 4)).toBe(1);
      expect(getNextOTPIndex(3, 4)).toBe(3);
    });

    it('should handle middle positions', () => {
      expect(getNextOTPIndex(1, 6)).toBe(2);
      expect(getNextOTPIndex(2, 6)).toBe(3);
      expect(getNextOTPIndex(3, 6)).toBe(4);
    });

    it('should not go beyond last index', () => {
      const lastIndex = 5;
      const length = 6;
      expect(getNextOTPIndex(lastIndex, length)).toBe(lastIndex);
    });
  });

  describe('getPreviousOTPIndex', () => {
    it('should return previous index when not at start', () => {
      expect(getPreviousOTPIndex(5)).toBe(4);
      expect(getPreviousOTPIndex(3)).toBe(2);
      expect(getPreviousOTPIndex(1)).toBe(0);
    });

    it('should stay at current index when at start', () => {
      expect(getPreviousOTPIndex(0)).toBe(0);
    });

    it('should handle middle positions', () => {
      expect(getPreviousOTPIndex(4)).toBe(3);
      expect(getPreviousOTPIndex(3)).toBe(2);
      expect(getPreviousOTPIndex(2)).toBe(1);
    });

    it('should not go below zero', () => {
      expect(getPreviousOTPIndex(0)).toBe(0);
    });
  });

  describe('processPastedOTP', () => {
    it('should process exact length OTP', () => {
      const result = processPastedOTP('123456', 6);
      expect(result).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should truncate longer OTP to specified length', () => {
      const result = processPastedOTP('12345678', 6);
      expect(result).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should pad shorter OTP with empty strings', () => {
      const result = processPastedOTP('123', 6);
      expect(result).toEqual(['1', '2', '3', '', '', '']);
    });

    it('should handle empty pasted data', () => {
      const result = processPastedOTP('', 6);
      expect(result).toEqual(['', '', '', '', '', '']);
    });

    it('should handle single character paste', () => {
      const result = processPastedOTP('5', 6);
      expect(result).toEqual(['5', '', '', '', '', '']);
    });

    it('should handle 4-digit OTP', () => {
      const result = processPastedOTP('1234', 4);
      expect(result).toEqual(['1', '2', '3', '4']);
    });

    it('should handle partial paste for 4-digit OTP', () => {
      const result = processPastedOTP('12', 4);
      expect(result).toEqual(['1', '2', '', '']);
    });

    it('should handle OTP with whitespace', () => {
      const result = processPastedOTP('1 2 3 4 5 6', 6);
      expect(result).toEqual(['1', ' ', '2', ' ', '3', ' ']);
    });

    it('should handle non-numeric characters', () => {
      const result = processPastedOTP('abc123', 6);
      expect(result).toEqual(['a', 'b', 'c', '1', '2', '3']);
    });

    it('should handle very long pasted data', () => {
      const result = processPastedOTP('1234567890123456789', 6);
      expect(result).toEqual(['1', '2', '3', '4', '5', '6']);
    });

    it('should create array of exact length', () => {
      expect(processPastedOTP('123', 6)).toHaveLength(6);
      expect(processPastedOTP('123456789', 4)).toHaveLength(4);
      expect(processPastedOTP('1', 8)).toHaveLength(8);
    });
  });
});
