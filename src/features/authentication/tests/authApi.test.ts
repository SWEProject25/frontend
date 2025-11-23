import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '@/mocks/server';
import { authApi } from '../services/authApi';
import {
  mockAuthUser,
  mockLoginResponse,
  mockRegisterResponse,
  mockSendOTPResponse,
  mockVerifyOTPResponse,
  mockResendOTPResponse,
  mockVerifyRecaptchaResponse,
  mockForgotPasswordResponse,
  mockResetPasswordResponse,
} from '../mocks/mockAuthData';
import { authErrorHandlers } from '../mocks/handlers';

describe('authApi', () => {
  beforeEach(() => {
    // Reset handlers before each test to ensure clean state
    server.resetHandlers();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        birthDate: '1990-01-01',
      };

      const response = await authApi.register(userData);

      expect(response).toEqual(mockRegisterResponse);
      expect(response.data.user).toEqual(mockAuthUser);
    });

    it('should handle registration error for existing user', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        name: 'Test User',
        birthDate: '1990-01-01',
      };

      await expect(authApi.register(userData)).rejects.toThrow(
        'User already exists'
      );
    });

    it('should handle 400 error with custom message', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User',
        birthDate: '1990-01-01',
      };

      await expect(authApi.register(userData)).rejects.toThrow(
        'Invalid email format'
      );
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const response = await authApi.login(credentials);

      expect(response).toEqual(mockLoginResponse);
      expect(response.data.user).toEqual(mockAuthUser);
    });

    it('should handle invalid credentials error', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      await expect(authApi.login(credentials)).rejects.toThrow(
        'Invalid email or password, please try again'
      );
    });

    it('should handle wrong email', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'Password123!',
      };

      await expect(authApi.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should successfully logout a user', async () => {
      await expect(authApi.logout()).resolves.not.toThrow();
    });

    it('should handle logout error', async () => {
      // Use error handler for this specific test
      server.use(authErrorHandlers.logoutError);

      await expect(authApi.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('sendOTP', () => {
    it('should successfully send OTP', async () => {
      const emailData = { email: 'test@example.com' };
      const response = await authApi.sendOTP(emailData);

      expect(response).toEqual(mockSendOTPResponse);
    });

    it('should handle sendOTP error', async () => {
      const emailData = { email: 'fail@example.com' };
      await expect(authApi.sendOTP(emailData)).rejects.toThrow();
    });
  });

  describe('verifyOTP', () => {
    it('should successfully verify OTP', async () => {
      const otpData = { email: 'test@example.com', otp: '123456' };
      const response = await authApi.verifyOTP(otpData);

      expect(response).toEqual(mockVerifyOTPResponse);
    });

    it('should handle invalid OTP error', async () => {
      const otpData = { email: 'test@example.com', otp: 'wrong' };
      await expect(authApi.verifyOTP(otpData)).rejects.toThrow('Invalid OTP');
    });
  });

  describe('resendOTP', () => {
    it('should successfully resend OTP', async () => {
      const emailData = { email: 'test@example.com' };
      const response = await authApi.resendOTP(emailData);

      expect(response).toEqual(mockResendOTPResponse);
    });

    it('should handle resendOTP error', async () => {
      const emailData = { email: 'fail@example.com' };
      await expect(authApi.resendOTP(emailData)).rejects.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('should successfully send forgot password email', async () => {
      const payload = { email: 'test@example.com', type: 'WEB' };
      const response = await authApi.forgotPassword(payload);

      expect(response).toEqual(mockForgotPasswordResponse);
    });

    it('should handle forgot password error', async () => {
      const payload = { email: 'nonexistent@example.com', type: 'WEB' };
      await expect(authApi.forgotPassword(payload)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const payload = {
        userId: 1,
        token: 'reset-token',
        newPassword: 'NewPassword123!',
        email: 'test@example.com',
      };
      const response = await authApi.resetPassword(payload);

      expect(response).toEqual(mockResetPasswordResponse);
    });

    it('should handle invalid token error', async () => {
      const payload = {
        userId: 1,
        token: 'invalid-token',
        newPassword: 'NewPassword123!',
      };
      await expect(authApi.resetPassword(payload)).rejects.toThrow(
        'Invalid or expired token'
      );
    });
  });

  describe('verifyRecaptcha', () => {
    it('should successfully verify recaptcha', async () => {
      const recaptchaData = { recaptcha: 'recaptcha-token' };
      const response = await authApi.verifyRecaptcha(recaptchaData);

      expect(response).toEqual(mockVerifyRecaptchaResponse);
    });

    it('should handle invalid recaptcha error', async () => {
      const recaptchaData = { recaptcha: 'invalid-token' };
      await expect(authApi.verifyRecaptcha(recaptchaData)).rejects.toThrow(
        'Invalid recaptcha token'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const user = await authApi.getCurrentUser();

      expect(user).toEqual(mockAuthUser);
      expect(user.id).toBe(mockAuthUser.id);
      expect(user.email).toBe(mockAuthUser.email);
    });
  });

  describe('oAuthLogin', () => {
    it('should open OAuth popup window', () => {
      // Mock window.open and window.addEventListener
      const mockOpen = vi.fn();
      const mockAddEventListener = vi.fn();
      global.window.open = mockOpen;
      global.window.addEventListener = mockAddEventListener;

      const callback = vi.fn();
      authApi.oAuthLogin('google', callback);

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('google'),
        'OAuthPopup',
        expect.stringContaining('width=500')
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function)
      );
    });
  });
});
