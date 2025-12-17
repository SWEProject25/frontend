import { describe, it, expect, vi } from 'vitest';
import { generateCaptchaText, validateCaptcha } from '../captchaUtils';
import { CAPTCHA_CONSTANTS } from '@/components/ui/forms/constants';

describe('captchaUtils', () => {
  describe('generateCaptchaText', () => {
    it('should generate captcha text of correct length', () => {
      const captcha = generateCaptchaText();
      expect(captcha).toHaveLength(CAPTCHA_CONSTANTS.LENGTH);
    });

    it('should generate captcha text with characters from CHARACTERS constant', () => {
      const captcha = generateCaptchaText();
      const chars = CAPTCHA_CONSTANTS.CHARACTERS;

      for (const char of captcha) {
        expect(chars).toContain(char);
      }
    });

    it('should generate different captcha texts on multiple calls', () => {
      const captchas = new Set();
      for (let i = 0; i < 50; i++) {
        captchas.add(generateCaptchaText());
      }
      // Should have generated at least some different captchas
      expect(captchas.size).toBeGreaterThan(1);
    });

    it('should only include alphanumeric characters', () => {
      const captcha = generateCaptchaText();
      const alphanumericRegex = /^[A-Za-z0-9]+$/;
      expect(captcha).toMatch(alphanumericRegex);
    });

    it('should generate captcha with uppercase letters', () => {
      // Generate multiple captchas to increase probability
      const captchas = Array.from({ length: 20 }, () => generateCaptchaText());
      const hasUppercase = captchas.some((captcha) => /[A-Z]/.test(captcha));
      expect(hasUppercase).toBe(true);
    });

    it('should not contain lowercase letters', () => {
      // CAPTCHA_CONSTANTS.CHARACTERS only has uppercase letters and numbers
      const captchas = Array.from({ length: 20 }, () => generateCaptchaText());
      const hasLowercase = captchas.some((captcha) => /[a-z]/.test(captcha));
      expect(hasLowercase).toBe(false);
    });

    it('should generate captcha with numbers', () => {
      // Generate multiple captchas to increase probability
      const captchas = Array.from({ length: 20 }, () => generateCaptchaText());
      const hasNumber = captchas.some((captcha) => /[0-9]/.test(captcha));
      expect(hasNumber).toBe(true);
    });

    it('should use Math.random for generation', () => {
      const mathRandomSpy = vi.spyOn(Math, 'random');
      generateCaptchaText();
      expect(mathRandomSpy).toHaveBeenCalled();
      mathRandomSpy.mockRestore();
    });
  });

  describe('validateCaptcha', () => {
    it('should return true for exact match', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('ABC123', captchaText)).toBe(true);
    });

    it('should return true for case-insensitive match', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('abc123', captchaText)).toBe(true);
      expect(validateCaptcha('AbC123', captchaText)).toBe(true);
      expect(validateCaptcha('ABC123', 'abc123')).toBe(true);
    });

    it('should return false for incorrect input', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('XYZ789', captchaText)).toBe(false);
    });

    it('should return false for partial match', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('ABC', captchaText)).toBe(false);
      expect(validateCaptcha('ABC12', captchaText)).toBe(false);
    });

    it('should return false for empty input', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('', captchaText)).toBe(false);
    });

    it('should return false for empty captcha text', () => {
      expect(validateCaptcha('ABC123', '')).toBe(false);
    });

    it('should return true when both are empty', () => {
      expect(validateCaptcha('', '')).toBe(true);
    });

    it('should handle leading/trailing spaces', () => {
      const captchaText = 'ABC123';
      // Note: The function doesn't trim, so these should fail
      expect(validateCaptcha(' ABC123', captchaText)).toBe(false);
      expect(validateCaptcha('ABC123 ', captchaText)).toBe(false);
    });

    it('should handle special characters correctly', () => {
      const captchaText = 'ABC!@#';
      expect(validateCaptcha('ABC!@#', captchaText)).toBe(true);
      expect(validateCaptcha('abc!@#', captchaText)).toBe(true);
    });

    it('should be case insensitive for all uppercase input', () => {
      const captchaText = 'ABCDEF';
      expect(validateCaptcha('abcdef', captchaText)).toBe(true);
      expect(validateCaptcha('ABCDEF', captchaText)).toBe(true);
      expect(validateCaptcha('AbCdEf', captchaText)).toBe(true);
    });

    it('should be case insensitive for all lowercase input', () => {
      const captchaText = 'abcdef';
      expect(validateCaptcha('ABCDEF', captchaText)).toBe(true);
      expect(validateCaptcha('abcdef', captchaText)).toBe(true);
      expect(validateCaptcha('AbCdEf', captchaText)).toBe(true);
    });

    it('should handle mixed alphanumeric captcha', () => {
      const captchaText = 'a1B2c3';
      expect(validateCaptcha('A1B2C3', captchaText)).toBe(true);
      expect(validateCaptcha('a1b2c3', captchaText)).toBe(true);
    });

    it('should return false for extra characters', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('ABC1234', captchaText)).toBe(false);
    });

    it('should return false for wrong order', () => {
      const captchaText = 'ABC123';
      expect(validateCaptcha('321CBA', captchaText)).toBe(false);
    });

    it('should handle numeric only captcha', () => {
      const captchaText = '123456';
      expect(validateCaptcha('123456', captchaText)).toBe(true);
    });

    it('should handle alphabetic only captcha', () => {
      const captchaText = 'ABCDEF';
      expect(validateCaptcha('abcdef', captchaText)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should validate generated captcha correctly', () => {
      const captchaText = generateCaptchaText();
      expect(validateCaptcha(captchaText, captchaText)).toBe(true);
      expect(validateCaptcha(captchaText.toLowerCase(), captchaText)).toBe(
        true
      );
      expect(validateCaptcha(captchaText.toUpperCase(), captchaText)).toBe(
        true
      );
    });

    it('should reject wrong input for generated captcha', () => {
      const captchaText = generateCaptchaText();
      const wrongInput = 'WRONG';
      if (wrongInput.toUpperCase() !== captchaText.toUpperCase()) {
        expect(validateCaptcha(wrongInput, captchaText)).toBe(false);
      }
    });

    it('should generate and validate multiple captchas', () => {
      for (let i = 0; i < 10; i++) {
        const captchaText = generateCaptchaText();
        expect(validateCaptcha(captchaText, captchaText)).toBe(true);
      }
    });
  });
});
