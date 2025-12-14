import { describe, it, expect, vi } from 'vitest';
import {
  handleCreateAccount,
  handleFormClose,
  getSubmitHandler,
} from '../authFormUtils';
import type { AuthModalType } from '@/components/ui/forms/types/components';

describe('authFormUtils', () => {
  describe('handleCreateAccount', () => {
    it('should call onSwitchModal with createAccount type', () => {
      const onSwitchModal = vi.fn();
      handleCreateAccount(onSwitchModal);
      expect(onSwitchModal).toHaveBeenCalledWith('createAccount');
      expect(onSwitchModal).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if onSwitchModal is undefined', () => {
      expect(() => handleCreateAccount(undefined)).not.toThrow();
    });

    it('should not do anything if onSwitchModal is not provided', () => {
      // Should just complete without error
      handleCreateAccount();
    });

    it('should handle onSwitchModal being null', () => {
      expect(() => handleCreateAccount(undefined)).not.toThrow();
    });
  });

  describe('handleFormClose', () => {
    it('should call clearFormState and onClose in order', () => {
      const callOrder: string[] = [];
      const clearFormState = vi.fn(() => callOrder.push('clear'));
      const onClose = vi.fn(() => callOrder.push('close'));

      handleFormClose(clearFormState, onClose);

      expect(clearFormState).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(callOrder).toEqual(['clear', 'close']);
    });

    it('should call both functions even if clearFormState throws', () => {
      const clearFormState = vi.fn(() => {
        throw new Error('Clear failed');
      });
      const onClose = vi.fn();

      expect(() => handleFormClose(clearFormState, onClose)).toThrow(
        'Clear failed'
      );
      expect(clearFormState).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should work with no-op functions', () => {
      const clearFormState = vi.fn();
      const onClose = vi.fn();

      handleFormClose(clearFormState, onClose);

      expect(clearFormState).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('getSubmitHandler', () => {
    const mockHandleLogin = vi.fn(async () => true);
    const mockHandleSignup = vi.fn(async () => true);
    const mockHandleForgotPassword = vi.fn(async () => true);
    const mockOnSwitchModal = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return handleLogin for login type', () => {
      const handler = getSubmitHandler(
        'login',
        mockHandleLogin,
        mockHandleSignup
      );

      expect(handler).toBe(mockHandleLogin);
    });

    it('should return wrapper function for signup type that calls handleCreateAccount', async () => {
      const handler = getSubmitHandler(
        'signup',
        mockHandleLogin,
        mockHandleSignup,
        undefined,
        mockOnSwitchModal
      );

      const result = await handler({}, 'step1');

      expect(result).toBe(true);
      expect(mockOnSwitchModal).toHaveBeenCalledWith('createAccount');
      expect(mockHandleSignup).not.toHaveBeenCalled();
    });

    it('should return handleForgotPassword for forgotPassword type when provided', () => {
      const handler = getSubmitHandler(
        'forgotPassword',
        mockHandleLogin,
        mockHandleSignup,
        mockHandleForgotPassword
      );

      expect(handler).toBe(mockHandleForgotPassword);
    });

    it('should return handleSignup as fallback when forgotPassword type but handler not provided', () => {
      const handler = getSubmitHandler(
        'forgotPassword',
        mockHandleLogin,
        mockHandleSignup
      );

      expect(handler).toBe(mockHandleSignup);
    });

    it('should return handleSignup for unknown type', () => {
      const handler = getSubmitHandler(
        'unknownType',
        mockHandleLogin,
        mockHandleSignup
      );

      expect(handler).toBe(mockHandleSignup);
    });

    it('should handle signup without onSwitchModal', async () => {
      const handler = getSubmitHandler(
        'signup',
        mockHandleLogin,
        mockHandleSignup
      );

      const result = await handler({}, 'step1');

      expect(result).toBe(true);
      // Should not throw even though onSwitchModal is undefined
    });

    it('should return handleLogin and work when called', async () => {
      const testData = { username: 'test', password: 'pass' };
      const handler = getSubmitHandler(
        'login',
        mockHandleLogin,
        mockHandleSignup
      );

      await handler(testData, 'loginStep');

      expect(mockHandleLogin).toHaveBeenCalledWith(testData, 'loginStep');
    });

    it('should return handleSignup and work when called', async () => {
      const testData = { email: 'test@example.com' };
      const handler = getSubmitHandler(
        'register',
        mockHandleLogin,
        mockHandleSignup
      );

      await handler(testData, 'signupStep');

      expect(mockHandleSignup).toHaveBeenCalledWith(testData, 'signupStep');
    });

    it('should return handleForgotPassword and work when called', async () => {
      const testData = { email: 'test@example.com' };
      const handler = getSubmitHandler(
        'forgotPassword',
        mockHandleLogin,
        mockHandleSignup,
        mockHandleForgotPassword
      );

      await handler(testData, 'resetStep');

      expect(mockHandleForgotPassword).toHaveBeenCalledWith(
        testData,
        'resetStep'
      );
    });

    it('should handle empty type string', () => {
      const handler = getSubmitHandler('', mockHandleLogin, mockHandleSignup);

      expect(handler).toBe(mockHandleSignup);
    });

    it('should be case sensitive for type checking', () => {
      const handler = getSubmitHandler(
        'Login',
        mockHandleLogin,
        mockHandleSignup
      );

      // Should not match 'login' (case sensitive)
      expect(handler).not.toBe(mockHandleLogin);
      expect(handler).toBe(mockHandleSignup);
    });

    it('should handle signup type with async execution', async () => {
      const handler = getSubmitHandler(
        'signup',
        mockHandleLogin,
        mockHandleSignup,
        undefined,
        mockOnSwitchModal
      );

      const promise = handler({ email: 'test@test.com' });

      expect(promise).toBeInstanceOf(Promise);
      const result = await promise;
      expect(result).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should handle full form close flow', () => {
      let formState = { data: 'some data' };
      const clearFormState = vi.fn(() => {
        formState = {};
      });
      let modalOpen = true;
      const onClose = vi.fn(() => {
        modalOpen = false;
      });

      handleFormClose(clearFormState, onClose);

      expect(formState).toEqual({});
      expect(modalOpen).toBe(false);
    });

    it('should switch modals correctly', () => {
      let currentModal: AuthModalType = 'login';
      const onSwitchModal = vi.fn(
        (newType: AuthModalType) => (currentModal = newType)
      );

      handleCreateAccount(onSwitchModal);

      expect(currentModal).toBe('createAccount');
    });

    it('should get correct handler based on auth flow', async () => {
      let loggedIn = false;
      const handleLogin = vi.fn(async () => {
        loggedIn = true;
        return true;
      });
      const handleSignup = vi.fn(async () => true);

      const loginHandler = getSubmitHandler('login', handleLogin, handleSignup);

      await loginHandler({ username: 'test' });

      expect(loggedIn).toBe(true);
      expect(handleLogin).toHaveBeenCalled();
    });
  });
});
