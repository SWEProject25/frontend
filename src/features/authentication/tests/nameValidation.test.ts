import { describe, it, expect } from 'vitest';
import { validateName, isValidNameFormat, NAME_ERROR_MESSAGES } from '../utils';
import { NAME_REGEX } from '../utils/nameValidation';

describe('Name Validation', () => {
  describe('NAME_REGEX', () => {
    it('should match valid names', () => {
      expect(NAME_REGEX.test('John Doe')).toBe(true);
      expect(NAME_REGEX.test('Alice')).toBe(true);
      expect(NAME_REGEX.test('Bob Smith Jr.')).toBe(true);
    });

    it('should not match names starting with spaces', () => {
      expect(NAME_REGEX.test(' John')).toBe(false);
    });

    it('should not match names ending with spaces', () => {
      expect(NAME_REGEX.test('John ')).toBe(false);
    });

    it('should not match too short names', () => {
      expect(NAME_REGEX.test('Jo')).toBe(false);
      expect(NAME_REGEX.test('J')).toBe(false);
    });

    it('should match names exactly at 50 characters', () => {
      const maxName = 'A' + 'b'.repeat(48) + 'C'; // 50 chars
      expect(NAME_REGEX.test(maxName)).toBe(true);
    });

    it('should not match names longer than 50 characters', () => {
      const longName = 'A' + 'b'.repeat(49) + 'C'; // 51 chars
      expect(NAME_REGEX.test(longName)).toBe(false);
    });
  });

  describe('isValidNameFormat', () => {
    it('should return true for valid names', () => {
      expect(isValidNameFormat('John Doe')).toBe(true);
      expect(isValidNameFormat('Alice Smith')).toBe(true);
    });

    it('should return false for invalid names', () => {
      expect(isValidNameFormat(' John')).toBe(false);
      expect(isValidNameFormat('Jo')).toBe(false);
      expect(isValidNameFormat('')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should return undefined for valid names', () => {
      expect(validateName('John Doe')).toBeUndefined();
      expect(validateName('Alice Smith')).toBeUndefined();
    });

    it('should return undefined for empty name', () => {
      expect(validateName('')).toBeUndefined();
    });

    it('should return error message for invalid names', () => {
      const result = validateName(' John');
      expect(result).toBe(NAME_ERROR_MESSAGES.INVALID_FORMAT);
    });

    it('should return error message for too short names', () => {
      const result = validateName('Jo');
      expect(result).toBe(NAME_ERROR_MESSAGES.INVALID_FORMAT);
    });

    it('should return error message for names with trailing spaces', () => {
      const result = validateName('John ');
      expect(result).toBe(NAME_ERROR_MESSAGES.INVALID_FORMAT);
    });

    it('should return error for names with emojis', () => {
      const result = validateName('John 😀');
      expect(result).toBe(NAME_ERROR_MESSAGES.ASCII_ONLY);
    });

    it('should return error for names with Unicode characters', () => {
      expect(validateName('Jöhn Doe')).toBe(NAME_ERROR_MESSAGES.ASCII_ONLY);
      expect(validateName('用户')).toBe(NAME_ERROR_MESSAGES.ASCII_ONLY);
    });

    it('should check ASCII before format', () => {
      // Even if format is invalid, ASCII check comes first
      const result = validateName('😀');
      expect(result).toBe(NAME_ERROR_MESSAGES.ASCII_ONLY);
    });

    it('should accept names with allowed special characters', () => {
      expect(validateName('John Doe Jr.')).toBeUndefined();
      expect(validateName("O'Brien")).toBeUndefined();
      expect(validateName('Jean-Paul')).toBeUndefined();
    });

    it('should return error for names with numbers', () => {
      expect(validateName('John123')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
      expect(validateName('John Doe 3')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
      expect(validateName('123 John')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
      expect(validateName('Jo3hn')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
      expect(validateName('User123')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
    });

    it('should validate in correct order: ASCII > Numbers > Format', () => {
      // Emoji with number - should fail on ASCII first
      expect(validateName('John😀123')).toBe(NAME_ERROR_MESSAGES.ASCII_ONLY);
      // Number with too short - should fail on number first
      expect(validateName('J1')).toBe(NAME_ERROR_MESSAGES.NO_NUMBERS);
    });
  });
});
