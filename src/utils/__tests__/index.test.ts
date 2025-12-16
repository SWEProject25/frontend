import { describe, it, expect } from 'vitest';
import {
  datePickerValueToISOString,
  getBirthDateOrNull,
  isoStringToDatePickerValue,
  compareDatesOrUndefined,
  convertFileToDataURL,
  formatDate,
  parseFormattedDate,
} from '../index';

describe('utils/index', () => {
  describe('datePickerValueToISOString', () => {
    it('should convert valid date picker value to ISO string', () => {
      const result = datePickerValueToISOString({
        year: '2000',
        month: '5',
        day: '15',
      });
      expect(result).toBeDefined();
      expect(result).toContain('2000-05-15');
    });

    it('should return undefined for missing year', () => {
      expect(
        datePickerValueToISOString({ month: '5', day: '15' })
      ).toBeUndefined();
    });

    it('should return undefined for missing month', () => {
      expect(
        datePickerValueToISOString({ year: '2000', day: '15' })
      ).toBeUndefined();
    });

    it('should return undefined for missing day', () => {
      expect(
        datePickerValueToISOString({ year: '2000', month: '5' })
      ).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(datePickerValueToISOString()).toBeUndefined();
    });

    it('should return undefined for invalid numbers', () => {
      expect(
        datePickerValueToISOString({
          year: 'invalid',
          month: '5',
          day: '15',
        })
      ).toBeUndefined();
    });
  });

  describe('getBirthDateOrNull', () => {
    it('should return date object for complete valid input', () => {
      const result = getBirthDateOrNull({
        year: '2000',
        month: '5',
        day: '15',
      });
      expect(result).toEqual({ year: '2000', month: '5', day: '15' });
    });

    it('should return undefined for completely undefined input', () => {
      expect(getBirthDateOrNull()).toBeUndefined();
    });

    it('should return null for all empty fields', () => {
      expect(getBirthDateOrNull({ year: '', month: '', day: '' })).toBeNull();
    });

    it('should return undefined for partially filled fields', () => {
      expect(
        getBirthDateOrNull({ year: '2000', month: '', day: '' })
      ).toBeUndefined();
    });

    it('should return undefined for missing year', () => {
      expect(getBirthDateOrNull({ month: '5', day: '15' })).toBeUndefined();
    });
  });

  describe('isoStringToDatePickerValue', () => {
    it('should convert ISO string to date picker value', () => {
      const result = isoStringToDatePickerValue('2000-05-15T00:00:00.000Z');
      expect(result).toEqual({ month: '05', day: '15', year: '2000' });
    });

    it('should return undefined for undefined input', () => {
      expect(isoStringToDatePickerValue()).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      expect(isoStringToDatePickerValue('')).toBeUndefined();
    });

    it('should return undefined for invalid date string', () => {
      expect(isoStringToDatePickerValue('invalid-date')).toBeUndefined();
    });

    it('should handle different ISO string formats', () => {
      const result = isoStringToDatePickerValue('2023-12-25');
      expect(result).toBeDefined();
      expect(result?.year).toBe('2023');
      expect(result?.month).toBe('12');
    });
  });

  describe('compareDatesOrUndefined', () => {
    it('should return undefined for same dates', () => {
      const date = '2000-05-15T00:00:00.000Z';
      expect(compareDatesOrUndefined(date, date)).toBeUndefined();
    });

    it('should return composedIso for different dates', () => {
      const date1 = '2000-05-15T00:00:00.000Z';
      const date2 = '2000-05-16T00:00:00.000Z';
      expect(compareDatesOrUndefined(date1, date2)).toBe(date1);
    });

    it('should return composedIso when initialIso is undefined', () => {
      const date = '2000-05-15T00:00:00.000Z';
      expect(compareDatesOrUndefined(date)).toBe(date);
    });

    it('should handle invalid dates gracefully', () => {
      const validDate = '2000-05-15T00:00:00.000Z';
      const invalidDate = 'invalid';
      expect(compareDatesOrUndefined(validDate, invalidDate)).toBe(validDate);
    });

    it('should compare only year, month, day (ignore time)', () => {
      const date1 = '2000-05-15T10:30:00.000Z';
      const date2 = '2000-05-15T15:45:00.000Z';
      expect(compareDatesOrUndefined(date1, date2)).toBeUndefined();
    });
  });

  describe('convertFileToDataURL', () => {
    it('should convert file to data URL', async () => {
      const file = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });
      const result = await convertFileToDataURL(file);
      expect(result).toContain('data:text/plain;base64,');
    });

    it('should handle image files', async () => {
      const file = new File(['fake image data'], 'test.png', {
        type: 'image/png',
      });
      const result = await convertFileToDataURL(file);
      expect(result).toContain('data:image/png;base64,');
    });
  });

  describe('formatDate', () => {
    it('should format date in long format by default', () => {
      const result = formatDate('2025-10-31T00:00:00.000Z');
      expect(result).toContain('October');
      expect(result).toContain('31');
      expect(result).toContain('2025');
    });

    it('should format date in short format', () => {
      const result = formatDate('2025-10-31T00:00:00.000Z', 'short');
      expect(result).toMatch(/10\/31\/2025/);
    });

    it('should format date in month-year format', () => {
      const result = formatDate('2025-10-31T00:00:00.000Z', 'month-year');
      expect(result).toContain('October');
      expect(result).toContain('2025');
      expect(result).not.toContain('31');
    });

    it('should return "Invalid date" for invalid date string', () => {
      expect(formatDate('invalid-date')).toBe('Invalid date');
    });
  });

  describe('parseFormattedDate', () => {
    describe('short format', () => {
      it('should parse short format date (M/D/YYYY)', () => {
        const result = parseFormattedDate('10/31/2025', 'short');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9); // October is month 9 (0-indexed)
        expect(date.getDate()).toBe(31);
      });

      it('should parse short format with single digits', () => {
        const result = parseFormattedDate('5/3/2025', 'short');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(4); // May is month 4 (0-indexed)
        expect(date.getDate()).toBe(3);
      });

      it('should return "Invalid date" for malformed short format', () => {
        expect(parseFormattedDate('invalid', 'short')).toBe('Invalid date');
        expect(parseFormattedDate('10-31-2025', 'short')).toBe('Invalid date');
      });

      it('should return "Invalid date" for non-numeric values', () => {
        expect(parseFormattedDate('abc/def/ghi', 'short')).toBe('Invalid date');
      });
    });

    describe('long format', () => {
      it('should parse long format date (MonthName D, YYYY)', () => {
        const result = parseFormattedDate('October 31, 2025', 'long');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9);
        expect(date.getDate()).toBe(31);
      });

      it('should parse long format with single digit day', () => {
        const result = parseFormattedDate('May 3, 2025', 'long');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(4);
        expect(date.getDate()).toBe(3);
      });

      it('should return "Invalid date" for malformed long format', () => {
        expect(parseFormattedDate('Invalid format', 'long')).toBe(
          'Invalid date'
        );
        expect(parseFormattedDate('October 2025', 'long')).toBe('Invalid date');
      });
    });

    describe('month-year format', () => {
      it('should parse month-year with month name', () => {
        const result = parseFormattedDate('October 2025', 'month-year');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9);
        expect(date.getDate()).toBe(1);
      });

      it('should parse month-year with numeric month (slash)', () => {
        const result = parseFormattedDate('10/2025', 'month-year');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9);
      });

      it('should parse month-year with numeric month (dash)', () => {
        const result = parseFormattedDate('10-2025', 'month-year');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9);
      });

      it('should parse month-year with numeric month (space)', () => {
        const result = parseFormattedDate('10 2025', 'month-year');
        expect(result).toBeDefined();
        expect(result).not.toBe('Invalid date');
        const date = new Date(result);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(9);
      });

      it('should return "Invalid date" for invalid month-year', () => {
        expect(parseFormattedDate('invalid', 'month-year')).toBe(
          'Invalid date'
        );
      });
    });

    it('should return "Invalid date" for empty string', () => {
      expect(parseFormattedDate('')).toBe('Invalid date');
    });

    it('should return "Invalid date" for non-string input', () => {
      expect(parseFormattedDate(null as any)).toBe('Invalid date');
    });
  });
});
