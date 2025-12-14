import { describe, it, expect } from 'vitest';
import { settingsUtils } from '..';

describe('settingsUtils', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(settingsUtils.validateEmail('test@example.com')).toBe(true);
      expect(settingsUtils.validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(settingsUtils.validateEmail('invalid-email')).toBe(false);
      expect(settingsUtils.validateEmail('@example.com')).toBe(false);
      expect(settingsUtils.validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone number format', () => {
      expect(settingsUtils.validatePhoneNumber('+1234567890')).toBe(true);
      expect(settingsUtils.validatePhoneNumber('123-456-7890')).toBe(true);
      expect(settingsUtils.validatePhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone number format', () => {
      expect(settingsUtils.validatePhoneNumber('invalid')).toBe(false);
      expect(settingsUtils.validatePhoneNumber('abc-def-ghij')).toBe(false);
    });
  });

  describe('formatSettingsData', () => {
    it('should return the same data', () => {
      const data = { username: 'testuser', email: 'test@example.com' };
      expect(settingsUtils.formatSettingsData(data)).toEqual(data);
    });
  });
});
