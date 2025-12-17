import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  validatePasswordDetailed,
  validatePasswordMatch,
  PASSWORD_ERROR_MESSAGES,
} from '../utils';
import { PASSWORD_REGEX } from '../utils/passwordValidation';

describe('Password Validation', () => {
  describe('PASSWORD_REGEX', () => {
    it('should match valid passwords', () => {
      expect(PASSWORD_REGEX.test('Password123!')).toBe(true);
      expect(PASSWORD_REGEX.test('Abcd1234@')).toBe(true);
      expect(PASSWORD_REGEX.test('Test123$Pass')).toBe(true);
    });

    it('should not match passwords without uppercase', () => {
      expect(PASSWORD_REGEX.test('password123!')).toBe(false);
    });

    it('should not match passwords without lowercase', () => {
      expect(PASSWORD_REGEX.test('PASSWORD123!')).toBe(false);
    });

    it('should not match passwords without numbers', () => {
      expect(PASSWORD_REGEX.test('Password!')).toBe(false);
    });

    it('should not match passwords without special characters', () => {
      expect(PASSWORD_REGEX.test('Password123')).toBe(false);
    });

    it('should not match passwords with spaces', () => {
      expect(PASSWORD_REGEX.test('Pass word123!')).toBe(false);
      expect(PASSWORD_REGEX.test(' Password123!')).toBe(false);
      expect(PASSWORD_REGEX.test('Password123! ')).toBe(false);
    });

    it('should not match passwords shorter than 8 characters', () => {
      expect(PASSWORD_REGEX.test('Pass1!')).toBe(false);
    });

    it('should not match passwords longer than 50 characters', () => {
      const longPassword = 'A1!' + 'a'.repeat(48); // 51 chars total
      expect(PASSWORD_REGEX.test(longPassword)).toBe(false);
    });

    it('should match password exactly at 50 characters', () => {
      const maxPassword = 'A1!' + 'a'.repeat(47); // 50 chars total
      expect(PASSWORD_REGEX.test(maxPassword)).toBe(true);
    });
  });

  describe('validatePasswordDetailed', () => {
    it('should return valid for a strong password', () => {
      const result = validatePasswordDetailed('Password123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should return error for password less than 8 characters', () => {
      const result = validatePasswordDetailed('Pass1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.MIN_LENGTH);
    });

    it('should return error for password more than 50 characters', () => {
      const longPassword = 'A1!' + 'a'.repeat(48); // 51 chars
      const result = validatePasswordDetailed(longPassword);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.MAX_LENGTH);
    });

    it('should return error for password without uppercase', () => {
      const result = validatePasswordDetailed('password123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.UPPERCASE);
    });

    it('should return error for password without lowercase', () => {
      const result = validatePasswordDetailed('PASSWORD123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.LOWERCASE);
    });

    it('should return error for password without number', () => {
      const result = validatePasswordDetailed('Password!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.NUMBER);
    });

    it('should return error for password without special character', () => {
      const result = validatePasswordDetailed('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.SPECIAL_CHAR);
    });

    it('should return error for password with spaces', () => {
      const result = validatePasswordDetailed('Pass word123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.NO_SPACES);
    });

    it('should return error for password with emojis', () => {
      const result = validatePasswordDetailed('Password123!😀');
      expect(result.valid).toBe(false);
      // Should fail the overall regex check
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return multiple errors for weak password', () => {
      const result = validatePasswordDetailed('pass');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.MIN_LENGTH);
      expect(result.errors).toContain(PASSWORD_ERROR_MESSAGES.UPPERCASE);
    });

    it('should handle empty password', () => {
      const result = validatePasswordDetailed('');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validatePassword', () => {
    it('should return undefined for valid password', () => {
      expect(validatePassword('Password123!')).toBeUndefined();
    });

    it('should return undefined for empty password', () => {
      expect(validatePassword('')).toBeUndefined();
    });

    it('should return error message for invalid password', () => {
      const result = validatePassword('weak');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should return joined error messages', () => {
      const result = validatePassword('pass');
      expect(result).toContain('At least 8 characters');
    });

    it('should detect spaces in password', () => {
      const result = validatePassword('Pass word123!');
      expect(result).toContain('No spaces allowed');
    });
  });

  describe('validatePasswordMatch', () => {
    it('should return undefined when passwords match', () => {
      expect(
        validatePasswordMatch('Password123!', 'Password123!')
      ).toBeUndefined();
    });

    it('should return error when passwords do not match', () => {
      const result = validatePasswordMatch('Password123!', 'Different123!');
      expect(result).toBe(PASSWORD_ERROR_MESSAGES.NO_MATCH);
    });

    it('should return undefined for empty passwords', () => {
      expect(validatePasswordMatch('', '')).toBeUndefined();
    });

    it('should return undefined if either password is empty', () => {
      expect(validatePasswordMatch('Password123!', '')).toBeUndefined();
      expect(validatePasswordMatch('', 'Password123!')).toBeUndefined();
    });
  });
});
