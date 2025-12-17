import { describe, it, expect } from 'vitest';
import {
  isValidEmailFormat,
  validateEmailASCII,
  validateEmail,
  normalizeEmail,
  EMAIL_ERROR_MESSAGES,
} from '../utils';
import { EMAIL_REGEX } from '../utils/emailValidation';

describe('Email Validation', () => {
  describe('EMAIL_REGEX', () => {
    it('should match valid email addresses', () => {
      expect(EMAIL_REGEX.test('test@example.com')).toBe(true);
      expect(EMAIL_REGEX.test('user.name@domain.co.uk')).toBe(true);
      expect(EMAIL_REGEX.test('test+tag@example.com')).toBe(true);
      expect(EMAIL_REGEX.test('User@Example.COM')).toBe(true); // Allows uppercase
    });

    it('should not match invalid email addresses', () => {
      expect(EMAIL_REGEX.test('invalid')).toBe(false);
      expect(EMAIL_REGEX.test('@example.com')).toBe(false);
      expect(EMAIL_REGEX.test('test@')).toBe(false);
      expect(EMAIL_REGEX.test('test@domain')).toBe(false);
      expect(EMAIL_REGEX.test('')).toBe(false);
    });
  });

  describe('isValidEmailFormat', () => {
    it('should return true for valid email formats', () => {
      expect(isValidEmailFormat('test@example.com')).toBe(true);
      expect(isValidEmailFormat('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should trim whitespace before validation', () => {
      expect(isValidEmailFormat(' test@example.com ')).toBe(true);
      expect(isValidEmailFormat('\tuser@domain.com\n')).toBe(true);
    });

    it('should accept uppercase letters', () => {
      expect(isValidEmailFormat('User@Example.COM')).toBe(true);
      expect(isValidEmailFormat('TEST@TEST.COM')).toBe(true);
    });

    it('should return false for invalid email formats', () => {
      expect(isValidEmailFormat('invalid-email')).toBe(false);
      expect(isValidEmailFormat('@example.com')).toBe(false);
      expect(isValidEmailFormat('test@')).toBe(false);
      expect(isValidEmailFormat('')).toBe(false);
    });
  });

  describe('validateEmailASCII', () => {
    it('should return undefined for ASCII-only emails', () => {
      expect(validateEmailASCII('test@example.com')).toBeUndefined();
      expect(validateEmailASCII('user123@domain.co.uk')).toBeUndefined();
    });

    it('should return error for emails with emojis', () => {
      const result = validateEmailASCII('test😀@example.com');
      expect(result).toBe(EMAIL_ERROR_MESSAGES.ASCII_ONLY);
    });

    it('should return error for emails with Unicode characters', () => {
      expect(validateEmailASCII('tëst@example.com')).toBe(
        EMAIL_ERROR_MESSAGES.ASCII_ONLY
      );
      expect(validateEmailASCII('用户@example.com')).toBe(
        EMAIL_ERROR_MESSAGES.ASCII_ONLY
      );
    });

    it('should trim before checking', () => {
      expect(validateEmailASCII(' test@example.com ')).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(validateEmailASCII('')).toBeUndefined();
    });
  });

  describe('validateEmail', () => {
    it('should return undefined for valid emails', () => {
      expect(validateEmail('test@example.com')).toBeUndefined();
      expect(validateEmail('user.name+tag@domain.co.uk')).toBeUndefined();
    });

    it('should check ASCII first before format', () => {
      const result = validateEmail('test😀@example.com');
      expect(result).toBe(EMAIL_ERROR_MESSAGES.ASCII_ONLY);
    });

    it('should return format error for invalid format', () => {
      expect(validateEmail('invalid-email')).toBe(
        EMAIL_ERROR_MESSAGES.INVALID_FORMAT
      );
      expect(validateEmail('test@')).toBe(EMAIL_ERROR_MESSAGES.INVALID_FORMAT);
    });

    it('should return undefined for empty string', () => {
      expect(validateEmail('')).toBeUndefined();
    });
  });

  describe('normalizeEmail', () => {
    it('should trim whitespace', () => {
      expect(normalizeEmail(' test@example.com ')).toBe('test@example.com');
      expect(normalizeEmail('\tuser@domain.com\n')).toBe('user@domain.com');
    });

    it('should convert to lowercase', () => {
      expect(normalizeEmail('User@Example.COM')).toBe('user@example.com');
      expect(normalizeEmail('TEST@TEST.COM')).toBe('test@test.com');
    });

    it('should handle both trim and lowercase', () => {
      expect(normalizeEmail(' User@Example.COM ')).toBe('user@example.com');
    });
  });
});
