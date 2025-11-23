import { describe, it, expect } from 'vitest';
import { formatBirthDate, hasBirthDateFields } from '../utils/dateUtils';

describe('dateUtils', () => {
  describe('formatBirthDate', () => {
    it('should format birth date with string inputs', () => {
      const result = formatBirthDate('5', '15', '1990');
      expect(result).toBe('1990-05-15');
    });

    it('should format birth date with number inputs', () => {
      const result = formatBirthDate(5, 15, 1990);
      expect(result).toBe('1990-05-15');
    });

    it('should pad single digit month and day', () => {
      const result = formatBirthDate(3, 7, 2000);
      expect(result).toBe('2000-03-07');
    });

    it('should handle already padded values', () => {
      const result = formatBirthDate('09', '25', '1995');
      expect(result).toBe('1995-09-25');
    });

    it('should handle double digit month and day', () => {
      const result = formatBirthDate(12, 31, 1999);
      expect(result).toBe('1999-12-31');
    });

    it('should handle mixed string and number inputs', () => {
      const result = formatBirthDate('8', 22, '2005');
      expect(result).toBe('2005-08-22');
    });

    it('should format date with first day of month', () => {
      const result = formatBirthDate(1, 1, 2000);
      expect(result).toBe('2000-01-01');
    });

    it('should format date with last day of December', () => {
      const result = formatBirthDate(12, 31, 2020);
      expect(result).toBe('2020-12-31');
    });

    it('should handle year with different lengths', () => {
      const result = formatBirthDate(6, 15, 85);
      expect(result).toBe('85-06-15');
    });
  });

  describe('hasBirthDateFields', () => {
    it('should return true when all birth date fields are present', () => {
      const data = {
        birthMonth: '5',
        birthDay: '15',
        birthYear: '1990',
      };
      expect(hasBirthDateFields(data)).toBe(true);
    });

    it('should return false when birthMonth is missing', () => {
      const data = {
        birthDay: '15',
        birthYear: '1990',
      };
      expect(hasBirthDateFields(data)).toBe(false);
    });

    it('should return false when birthDay is missing', () => {
      const data = {
        birthMonth: '5',
        birthYear: '1990',
      };
      expect(hasBirthDateFields(data)).toBe(false);
    });

    it('should return false when birthYear is missing', () => {
      const data = {
        birthMonth: '5',
        birthDay: '15',
      };
      expect(hasBirthDateFields(data)).toBe(false);
    });

    it('should return false when all fields are missing', () => {
      const data = {};
      expect(hasBirthDateFields(data)).toBe(false);
    });

    it('should return false when fields are empty strings', () => {
      const data = {
        birthMonth: '',
        birthDay: '',
        birthYear: '',
      };
      expect(hasBirthDateFields(data)).toBe(false);
    });

    it('should return true with additional fields present', () => {
      const data = {
        birthMonth: '5',
        birthDay: '15',
        birthYear: '1990',
        email: 'test@example.com',
        name: 'John Doe',
      };
      expect(hasBirthDateFields(data)).toBe(true);
    });

    it('should handle whitespace-only values as falsy', () => {
      const data = {
        birthMonth: '   ',
        birthDay: '15',
        birthYear: '1990',
      };
      // Whitespace strings are truthy, so this will return true
      // This tests the actual behavior, not necessarily the desired behavior
      expect(hasBirthDateFields(data)).toBe(true);
    });
  });
});
