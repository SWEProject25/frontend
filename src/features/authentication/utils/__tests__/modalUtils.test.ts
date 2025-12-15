import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isMobileScreen,
  getModalType,
  getFullScreenFormType,
  isValidModalType,
  AUTH_MODAL_STORAGE_KEY,
} from '../modalUtils';

describe('modalUtils', () => {
  describe('isMobileScreen', () => {
    const originalWindow = global.window;

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return false when window is undefined', () => {
      global.window = undefined as any;
      expect(isMobileScreen()).toBe(false);
    });

    it('should return true when window width is less than mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      expect(isMobileScreen()).toBe(true);
    });

    it('should return false when window width is greater than or equal to mobile breakpoint', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 710,
      });

      expect(isMobileScreen()).toBe(false);
    });

    it('should return false for desktop width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      expect(isMobileScreen()).toBe(false);
    });

    it('should return true for small mobile width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      expect(isMobileScreen()).toBe(true);
    });

    it('should handle edge case of exactly mobile breakpoint - 1', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 709,
      });

      expect(isMobileScreen()).toBe(true);
    });
  });

  describe('getModalType', () => {
    it('should return null when activeModal is null', () => {
      expect(getModalType(null)).toBe(null);
    });

    it('should return the activeModal value when provided', () => {
      expect(getModalType('login')).toBe('login');
      expect(getModalType('createAccount')).toBe('createAccount');
      expect(getModalType('forgotPassword')).toBe('forgotPassword');
    });

    it('should return activeModal for any string value', () => {
      expect(getModalType('customModal')).toBe('customModal');
    });

    it('should return null when activeModal is empty string', () => {
      expect(getModalType('')).toBe(null);
    });
  });

  describe('getFullScreenFormType', () => {
    it('should return null when activeModal is null', () => {
      expect(getFullScreenFormType(null, true)).toBe(null);
      expect(getFullScreenFormType(null, false)).toBe(null);
    });

    it('should return null when isMobile is false', () => {
      expect(getFullScreenFormType('login', false)).toBe(null);
      expect(getFullScreenFormType('createAccount', false)).toBe(null);
    });

    it('should return activeModal when both activeModal is provided and isMobile is true', () => {
      expect(getFullScreenFormType('login', true)).toBe('login');
      expect(getFullScreenFormType('createAccount', true)).toBe(
        'createAccount'
      );
      expect(getFullScreenFormType('forgotPassword', true)).toBe(
        'forgotPassword'
      );
    });

    it('should return null when activeModal is empty string and isMobile is true', () => {
      expect(getFullScreenFormType('', true)).toBe(null);
    });

    it('should handle all combinations correctly', () => {
      const combinations = [
        { activeModal: 'login', isMobile: true, expected: 'login' },
        { activeModal: 'login', isMobile: false, expected: null },
        { activeModal: null, isMobile: true, expected: null },
        { activeModal: null, isMobile: false, expected: null },
        { activeModal: '', isMobile: true, expected: null },
      ];

      combinations.forEach(({ activeModal, isMobile, expected }) => {
        expect(getFullScreenFormType(activeModal, isMobile)).toBe(expected);
      });
    });
  });

  describe('isValidModalType', () => {
    it('should return true for valid modal types', () => {
      expect(isValidModalType('login')).toBe(true);
      expect(isValidModalType('createAccount')).toBe(true);
      expect(isValidModalType('forgotPassword')).toBe(true);
    });

    it('should return false for invalid modal types', () => {
      expect(isValidModalType('invalidType')).toBe(false);
      expect(isValidModalType('')).toBe(false);
      expect(isValidModalType('Login')).toBe(false); // case sensitive
    });

    it('should return false for non-string values', () => {
      expect(isValidModalType(null)).toBe(false);
      expect(isValidModalType(undefined)).toBe(false);
      expect(isValidModalType(123)).toBe(false);
      expect(isValidModalType({})).toBe(false);
      expect(isValidModalType([])).toBe(false);
      expect(isValidModalType(true)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidModalType({ toString: () => 'login' })).toBe(false);
      expect(isValidModalType(NaN)).toBe(false);
    });
  });

  describe('AUTH_MODAL_STORAGE_KEY', () => {
    it('should export the correct storage key', () => {
      expect(AUTH_MODAL_STORAGE_KEY).toBe('auth.activeModal');
    });

    it('should be a string', () => {
      expect(typeof AUTH_MODAL_STORAGE_KEY).toBe('string');
    });
  });

  describe('integration tests', () => {
    it('should determine correct UI state based on screen size', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      const isMobile = isMobileScreen();
      const activeModal = 'login';

      const modalType = getModalType(activeModal);
      const fullScreenType = getFullScreenFormType(activeModal, isMobile);

      expect(isMobile).toBe(true);
      expect(modalType).toBe('login');
      expect(fullScreenType).toBe('login');
    });

    it('should determine correct UI state for desktop', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const isMobile = isMobileScreen();
      const activeModal = 'login';

      const modalType = getModalType(activeModal);
      const fullScreenType = getFullScreenFormType(activeModal, isMobile);

      expect(isMobile).toBe(false);
      expect(modalType).toBe('login');
      expect(fullScreenType).toBe(null);
    });

    it('should validate modal types correctly in a flow', () => {
      const modalType = 'login';

      if (isValidModalType(modalType)) {
        const type = getModalType(modalType);
        expect(type).toBe('login');
      }
    });

    it('should handle invalid modal gracefully', () => {
      const modalType = 'invalid';

      expect(isValidModalType(modalType)).toBe(false);
      expect(getModalType(modalType)).toBe('invalid'); // Still returns it, but validation failed
    });
  });
});
