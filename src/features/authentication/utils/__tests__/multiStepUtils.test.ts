import { describe, it, expect } from 'vitest';
import { getConfigKey, getInitialValues } from '../multiStepUtils';
import type {
  AllSteps,
  AuthModalType,
} from '@/components/ui/forms/types/components';

describe('multiStepUtils', () => {
  describe('getConfigKey', () => {
    it('should return login for email step', () => {
      expect(getConfigKey('email', 'login')).toBe('login');
      expect(getConfigKey('email', 'createAccount')).toBe('login');
      expect(getConfigKey('email', 'forgotPassword')).toBe('login');
    });

    it('should return signup for signup step', () => {
      expect(getConfigKey('signup', 'login')).toBe('signup');
      expect(getConfigKey('signup', 'createAccount')).toBe('signup');
    });

    it('should return otp for otp step', () => {
      expect(getConfigKey('otp', 'login')).toBe('otp');
      expect(getConfigKey('otp', 'createAccount')).toBe('otp');
      expect(getConfigKey('otp', 'forgotPassword')).toBe('otp');
    });

    it('should return loginPassword for password step with login type', () => {
      expect(getConfigKey('password', 'login')).toBe('loginPassword');
    });

    it('should return password for password step with createAccount type', () => {
      expect(getConfigKey('password', 'createAccount')).toBe('password');
    });

    it('should return resetPassword for password step with forgotPassword type', () => {
      expect(getConfigKey('password', 'forgotPassword')).toBe('resetPassword');
    });

    it('should return forgotPassword for forgotPassword step', () => {
      expect(getConfigKey('forgotPassword', 'login')).toBe('forgotPassword');
    });

    it('should return the step itself for unknown steps', () => {
      const unknownStep = 'unknownStep' as AllSteps;
      expect(getConfigKey(unknownStep, 'login')).toBe(unknownStep);
    });

    it('should handle all valid password type combinations', () => {
      const types: AuthModalType[] = [
        'login',
        'createAccount',
        'forgotPassword',
      ];
      const results = types.map((type) => getConfigKey('password', type));

      expect(results).toContain('loginPassword');
      expect(results).toContain('password');
      expect(results).toContain('resetPassword');
    });
  });

  describe('getInitialValues', () => {
    describe('login flow', () => {
      it('should return email and identifier for login password step with email data', () => {
        const stepData = {
          email: { identifier: 'test@example.com' },
        };

        const result = getInitialValues('login', 'password', stepData);

        expect(result).toEqual({
          email: 'test@example.com',
          identifier: 'test@example.com',
        });
      });

      it('should return empty object for login password step without email data', () => {
        const stepData = {};

        const result = getInitialValues('login', 'password', stepData);

        expect(result).toEqual({});
      });

      it('should return empty object for login email step', () => {
        const stepData = {
          email: { identifier: 'test@example.com' },
        };

        const result = getInitialValues('login', 'email', stepData);

        expect(result).toEqual({});
      });

      it('should return empty object when email.identifier is missing', () => {
        const stepData = {
          email: {},
        };

        const result = getInitialValues('login', 'password', stepData);

        expect(result).toEqual({});
      });
    });

    describe('createAccount flow', () => {
      it('should return email and identifier for createAccount otp step with register data', () => {
        const stepData = {
          register: { email: 'newuser@example.com' },
        };

        const result = getInitialValues('createAccount', 'otp', stepData);

        expect(result).toEqual({
          email: 'newuser@example.com',
          identifier: 'newuser@example.com',
        });
      });

      it('should return empty object for createAccount otp step without register data', () => {
        const stepData = {};

        const result = getInitialValues('createAccount', 'otp', stepData);

        expect(result).toEqual({});
      });

      it('should return empty object for createAccount password step', () => {
        const stepData = {
          register: { email: 'newuser@example.com' },
        };

        const result = getInitialValues('createAccount', 'password', stepData);

        expect(result).toEqual({});
      });

      it('should return empty object when register.email is missing', () => {
        const stepData = {
          register: {},
        };

        const result = getInitialValues('createAccount', 'otp', stepData);

        expect(result).toEqual({});
      });
    });

    describe('forgotPassword flow', () => {
      it('should return email and identifier for forgotPassword otp step', () => {
        const stepData = {
          forgotPassword: { email: 'forgot@example.com' },
        };

        const result = getInitialValues('forgotPassword', 'otp', stepData);

        expect(result).toEqual({
          email: 'forgot@example.com',
          identifier: 'forgot@example.com',
        });
      });

      it('should return email and identifier for forgotPassword password step', () => {
        const stepData = {
          forgotPassword: { email: 'forgot@example.com' },
        };

        const result = getInitialValues('forgotPassword', 'password', stepData);

        expect(result).toEqual({
          email: 'forgot@example.com',
          identifier: 'forgot@example.com',
        });
      });

      it('should return empty object for forgotPassword email step', () => {
        const stepData = {
          forgotPassword: { email: 'forgot@example.com' },
        };

        const result = getInitialValues(
          'forgotPassword',
          'forgotPassword',
          stepData
        );

        expect(result).toEqual({});
      });

      it('should return empty object when forgotPassword.email is missing', () => {
        const stepData = {
          forgotPassword: {},
        };

        const result = getInitialValues('forgotPassword', 'otp', stepData);

        expect(result).toEqual({});
      });
    });

    describe('edge cases', () => {
      it('should handle empty stepData object', () => {
        const stepData = {};

        expect(getInitialValues('login', 'password', stepData)).toEqual({});
        expect(getInitialValues('createAccount', 'otp', stepData)).toEqual({});
        expect(getInitialValues('forgotPassword', 'otp', stepData)).toEqual({});
      });

      it('should handle stepData with irrelevant properties', () => {
        const stepData = {
          randomKey: { randomValue: 'test' },
        };

        expect(getInitialValues('login', 'password', stepData)).toEqual({});
      });

      it('should preserve email values without modification', () => {
        const stepData = {
          email: { identifier: 'test@EXAMPLE.COM' },
        };

        const result = getInitialValues('login', 'password', stepData);

        expect(result.email).toBe('test@EXAMPLE.COM');
        expect(result.identifier).toBe('test@EXAMPLE.COM');
      });

      it('should handle special characters in email', () => {
        const stepData = {
          register: { email: 'user+test@example.com' },
        };

        const result = getInitialValues('createAccount', 'otp', stepData);

        expect(result.email).toBe('user+test@example.com');
      });
    });

    describe('all flows combined', () => {
      it('should return appropriate values for all valid combinations', () => {
        const testCases = [
          {
            type: 'login' as AuthModalType,
            step: 'password' as AllSteps,
            data: { email: { identifier: 'login@test.com' } },
            expected: { email: 'login@test.com', identifier: 'login@test.com' },
          },
          {
            type: 'createAccount' as AuthModalType,
            step: 'otp' as AllSteps,
            data: { register: { email: 'register@test.com' } },
            expected: {
              email: 'register@test.com',
              identifier: 'register@test.com',
            },
          },
          {
            type: 'forgotPassword' as AuthModalType,
            step: 'otp' as AllSteps,
            data: { forgotPassword: { email: 'forgot@test.com' } },
            expected: {
              email: 'forgot@test.com',
              identifier: 'forgot@test.com',
            },
          },
          {
            type: 'forgotPassword' as AuthModalType,
            step: 'password' as AllSteps,
            data: { forgotPassword: { email: 'reset@test.com' } },
            expected: { email: 'reset@test.com', identifier: 'reset@test.com' },
          },
        ];

        testCases.forEach(({ type, step, data, expected }) => {
          expect(getInitialValues(type, step, data)).toEqual(expected);
        });
      });
    });
  });
});
