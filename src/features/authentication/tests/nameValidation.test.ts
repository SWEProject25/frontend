import { describe, it, expect } from 'vitest';
import { validateName, isValidNameFormat, NAME_ERROR_MESSAGES } from '../utils';
import { NAME_REGEX } from '../utils/nameValidation';

describe('Name Validation', () => {
  describe('NAME_REGEX', () => {
    it('should match valid names with ASCII letters', () => {
      expect(NAME_REGEX.test('John Doe')).toBe(true);
      expect(NAME_REGEX.test('Alice')).toBe(true);
      expect(NAME_REGEX.test('Mary-Jane')).toBe(true);
      expect(NAME_REGEX.test("O'Brien")).toBe(true);
    });

    it('should match names with Unicode letters and accents', () => {
      expect(NAME_REGEX.test('José García')).toBe(true);
      expect(NAME_REGEX.test('François')).toBe(true);
      expect(NAME_REGEX.test('Müller')).toBe(true);
      expect(NAME_REGEX.test('Søren')).toBe(true);
      expect(NAME_REGEX.test('Владимир')).toBe(true);
      expect(NAME_REGEX.test('محمد')).toBe(true);
      expect(NAME_REGEX.test('张伟')).toBe(true);
    });

    it('should not match names with numbers', () => {
      expect(NAME_REGEX.test('John123')).toBe(false);
      expect(NAME_REGEX.test('Jo3hn')).toBe(false);
    });

    it('should not match names with emojis', () => {
      expect(NAME_REGEX.test('John 😀')).toBe(false);
      expect(NAME_REGEX.test('😀')).toBe(false);
    });

    it('should not match names with special punctuation', () => {
      expect(NAME_REGEX.test('John!')).toBe(false);
      expect(NAME_REGEX.test('John@Doe')).toBe(false);
      expect(NAME_REGEX.test('John.Doe')).toBe(false);
      expect(NAME_REGEX.test('John,Doe')).toBe(false);
    });

    it('should match names with allowed characters: space, hyphen, apostrophe', () => {
      expect(NAME_REGEX.test('John Doe')).toBe(true);
      expect(NAME_REGEX.test('Mary-Jane')).toBe(true);
      expect(NAME_REGEX.test("O'Brien")).toBe(true);
      expect(NAME_REGEX.test('Jean-François')).toBe(true);
      expect(NAME_REGEX.test("Mary-Jane O'Brien")).toBe(true);
    });
  });

  describe('isValidNameFormat', () => {
    it('should return true for valid names', () => {
      expect(isValidNameFormat('John Doe')).toBe(true);
      expect(isValidNameFormat('Alice Smith')).toBe(true);
      expect(isValidNameFormat('José García')).toBe(true);
      expect(isValidNameFormat('François')).toBe(true);
    });

    it('should return false for names with invalid characters', () => {
      expect(isValidNameFormat('John123')).toBe(false);
      expect(isValidNameFormat('John 😀')).toBe(false);
      expect(isValidNameFormat('John!')).toBe(false);
    });

    it('should return false for names with leading/trailing spaces', () => {
      expect(isValidNameFormat(' John')).toBe(false);
      expect(isValidNameFormat('John ')).toBe(false);
    });

    it('should return false for too short names', () => {
      expect(isValidNameFormat('Jo')).toBe(false);
      expect(isValidNameFormat('J')).toBe(false);
    });

    it('should return false for empty name', () => {
      expect(isValidNameFormat('')).toBe(false);
    });
  });

  describe('validateName', () => {
    it('should return undefined for valid ASCII names', () => {
      expect(validateName('John Doe')).toBeUndefined();
      expect(validateName('Alice Smith')).toBeUndefined();
      expect(validateName("Mary-Jane O'Brien")).toBeUndefined();
    });

    it('should return undefined for valid Unicode names with accents', () => {
      expect(validateName('José García')).toBeUndefined();
      expect(validateName('François')).toBeUndefined();
      expect(validateName('Müller')).toBeUndefined();
      expect(validateName('Jean-François')).toBeUndefined();
      expect(validateName('Владимир Путин')).toBeUndefined();
      expect(validateName('محمد علي')).toBeUndefined();
      expect(validateName('张伟明')).toBeUndefined(); // 3 characters
    });

    it('should return undefined for empty name', () => {
      expect(validateName('')).toBeUndefined();
    });

    it('should return specific error for names with leading spaces', () => {
      const result = validateName(' John');
      expect(result).toBe(NAME_ERROR_MESSAGES.LEADING_TRAILING_SPACES);
    });

    it('should return specific error for names with trailing spaces', () => {
      const result = validateName('John ');
      expect(result).toBe(NAME_ERROR_MESSAGES.LEADING_TRAILING_SPACES);
    });

    it('should return specific error for too short names', () => {
      const result = validateName('Jo');
      expect(result).toBe(NAME_ERROR_MESSAGES.TOO_SHORT);
    });

    it('should return specific error for too long names', () => {
      const longName = 'A'.repeat(51); // 51 chars
      const result = validateName(longName);
      expect(result).toBe(NAME_ERROR_MESSAGES.TOO_LONG);
    });

    it('should return specific error for names with emojis', () => {
      const result = validateName('John 😀');
      expect(result).toBe(NAME_ERROR_MESSAGES.HAS_EMOJIS);
    });

    it('should return specific error for names with numbers', () => {
      expect(validateName('John123')).toBe(NAME_ERROR_MESSAGES.HAS_NUMBERS);
      expect(validateName('John Doe 3')).toBe(NAME_ERROR_MESSAGES.HAS_NUMBERS);
      expect(validateName('123 John')).toBe(NAME_ERROR_MESSAGES.HAS_NUMBERS);
      expect(validateName('Jo3hn')).toBe(NAME_ERROR_MESSAGES.HAS_NUMBERS);
      expect(validateName('User123')).toBe(NAME_ERROR_MESSAGES.HAS_NUMBERS);
    });

    it('should return specific error for names with special punctuation', () => {
      expect(validateName('John!')).toBe(NAME_ERROR_MESSAGES.HAS_SPECIAL_CHARS);
      expect(validateName('John.Doe')).toBe(
        NAME_ERROR_MESSAGES.HAS_SPECIAL_CHARS
      );
      expect(validateName('John@Doe')).toBe(
        NAME_ERROR_MESSAGES.HAS_SPECIAL_CHARS
      );
      expect(validateName('John,Doe')).toBe(
        NAME_ERROR_MESSAGES.HAS_SPECIAL_CHARS
      );
    });

    it('should accept names with allowed special characters', () => {
      expect(validateName('John Doe')).toBeUndefined();
      expect(validateName("O'Brien")).toBeUndefined();
      expect(validateName('Jean-Paul')).toBeUndefined();
      expect(validateName('Mary Jane')).toBeUndefined();
    });

    it('should validate in specific order: spaces > length > character type', () => {
      // Leading/trailing spaces should be caught first
      expect(validateName(' J1')).toBe(
        NAME_ERROR_MESSAGES.LEADING_TRAILING_SPACES
      );
      // Too short should be caught before invalid characters
      expect(validateName('J1')).toBe(NAME_ERROR_MESSAGES.TOO_SHORT);
      // Too long should be caught before invalid characters
      const longInvalidName = 'A'.repeat(51) + '123';
      expect(validateName(longInvalidName)).toBe(NAME_ERROR_MESSAGES.TOO_LONG);
    });

    it('should accept minimum length of 3 characters', () => {
      expect(validateName('Ann')).toBeUndefined();
      expect(validateName('李明白')).toBeUndefined(); // 3 Chinese characters
    });

    it('should accept maximum length of 50 characters', () => {
      const maxName = 'A'.repeat(50);
      expect(validateName(maxName)).toBeUndefined();
    });
  });
});
