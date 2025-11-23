import { http, HttpResponse } from 'msw';
import { AUTH_API_CONFIG, AUTH_ENDPOINTS } from '../constants/api';
import {
  mockLoginResponse,
  mockRegisterResponse,
  mockLogoutResponse,
  mockSendOTPResponse,
  mockVerifyOTPResponse,
  mockResendOTPResponse,
  mockVerifyRecaptchaResponse,
  mockForgotPasswordResponse,
  mockResetPasswordResponse,
  mockMeResponse,
  mockInvalidCredentialsError,
  mockUserExistsError,
  mockInvalidEmailError,
  mockInvalidOTPError,
  mockInvalidRecaptchaError,
  mockUnauthorizedError,
  mockUserNotFoundError,
  mockInvalidTokenError,
} from './mockAuthData';

/**
 * MSW Request Handlers for Authentication API
 * These handlers intercept HTTP requests and return mock responses
 */

const buildUrl = (endpoint: string) => `${AUTH_API_CONFIG.BASE_URL}${endpoint}`;

export const authHandlers = [
  // POST /api/v1.0/auth/register - Register new user
  http.post(buildUrl(AUTH_ENDPOINTS.REGISTER), async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      name: string;
      password: string;
      birthDate: string;
    };

    // Simulate existing user error
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(mockUserExistsError, { status: 409 });
    }

    // Simulate invalid email error
    if (body.email === 'invalid-email') {
      return HttpResponse.json(mockInvalidEmailError, { status: 400 });
    }

    return HttpResponse.json(mockRegisterResponse, { status: 201 });
  }),

  // POST /api/v1.0/auth/login - User login
  http.post(buildUrl(AUTH_ENDPOINTS.LOGIN), async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
    };

    // Simulate invalid credentials
    if (
      body.email === 'wrong@example.com' ||
      body.password === 'WrongPassword'
    ) {
      return HttpResponse.json(mockInvalidCredentialsError, { status: 401 });
    }

    return HttpResponse.json(mockLoginResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/logout - User logout
  http.post(buildUrl(AUTH_ENDPOINTS.LOGOUT), () => {
    return HttpResponse.json(mockLogoutResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/verification-otp - Send OTP for email verification
  http.post(buildUrl(AUTH_ENDPOINTS.VERIFICATION_OTP), async ({ request }) => {
    const body = (await request.json()) as { email: string };

    // Simulate error for specific email
    if (body.email === 'fail@example.com') {
      return HttpResponse.json(
        { message: 'Failed to send OTP' },
        { status: 500 }
      );
    }

    return HttpResponse.json(mockSendOTPResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/verify-otp - Verify OTP
  http.post(buildUrl(AUTH_ENDPOINTS.VERIFY_OTP), async ({ request }) => {
    const body = (await request.json()) as { email: string; otp: string };

    // Simulate invalid OTP
    if (body.otp === 'wrong' || body.otp === '000000') {
      return HttpResponse.json(mockInvalidOTPError, { status: 400 });
    }

    return HttpResponse.json(mockVerifyOTPResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/resend-otp - Resend OTP
  http.post(buildUrl(AUTH_ENDPOINTS.RESEND_OTP), async ({ request }) => {
    const body = (await request.json()) as { email: string };

    // Simulate error for specific email
    if (body.email === 'fail@example.com') {
      return HttpResponse.json(
        { message: 'Failed to resend OTP' },
        { status: 500 }
      );
    }

    return HttpResponse.json(mockResendOTPResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/verify-recaptcha - Verify reCAPTCHA
  http.post(buildUrl(AUTH_ENDPOINTS.VERIFY_RECAPTCHA), async ({ request }) => {
    const body = (await request.json()) as { recaptcha: string };

    // Simulate invalid recaptcha
    if (body.recaptcha === 'invalid-token') {
      return HttpResponse.json(mockInvalidRecaptchaError, { status: 400 });
    }

    return HttpResponse.json(mockVerifyRecaptchaResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/forgotPassword - Forgot password
  http.post(buildUrl(AUTH_ENDPOINTS.FORGOT_PASSWORD), async ({ request }) => {
    const body = (await request.json()) as { email: string; type?: string };

    // Simulate user not found
    if (body.email === 'nonexistent@example.com') {
      return HttpResponse.json(mockUserNotFoundError, { status: 404 });
    }

    return HttpResponse.json(mockForgotPasswordResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/resetPassword - Reset password
  http.post(buildUrl(AUTH_ENDPOINTS.RESET_PASSWORD), async ({ request }) => {
    const body = (await request.json()) as {
      userId: number;
      token: string;
      newPassword: string;
      email?: string;
    };

    // Simulate invalid token
    if (body.token === 'invalid-token') {
      return HttpResponse.json(mockInvalidTokenError, { status: 400 });
    }

    return HttpResponse.json(mockResetPasswordResponse, { status: 200 });
  }),

  // GET /api/v1.0/auth/me - Get current user
  http.get(buildUrl(AUTH_ENDPOINTS.ME), () => {
    return HttpResponse.json(mockMeResponse, { status: 200 });
  }),

  // POST /api/v1.0/auth/check-email - Check if email exists
  http.post(buildUrl(AUTH_ENDPOINTS.CHECK_EMAIL), async ({ request }) => {
    const body = (await request.json()) as { email: string };

    // Simulate email already taken
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'Email has already been taken.' },
        { status: 409 }
      );
    }

    // Simulate invalid email format
    if (body.email === 'invalid-email') {
      return HttpResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { status: 'success', message: 'Email is available' },
      { status: 200 }
    );
  }),
];

/**
 * Error handlers for testing error scenarios
 * Use these by spreading them into the handlers array when needed
 */
export const authErrorHandlers = {
  loginUnauthorized: http.post(buildUrl(AUTH_ENDPOINTS.LOGIN), () => {
    return HttpResponse.json(mockInvalidCredentialsError, { status: 401 });
  }),

  registerConflict: http.post(buildUrl(AUTH_ENDPOINTS.REGISTER), () => {
    return HttpResponse.json(mockUserExistsError, { status: 409 });
  }),

  logoutError: http.post(buildUrl(AUTH_ENDPOINTS.LOGOUT), () => {
    return HttpResponse.json({ message: 'Logout failed' }, { status: 500 });
  }),

  otpError: http.post(buildUrl(AUTH_ENDPOINTS.VERIFY_OTP), () => {
    return HttpResponse.json(mockInvalidOTPError, { status: 400 });
  }),

  recaptchaError: http.post(buildUrl(AUTH_ENDPOINTS.VERIFY_RECAPTCHA), () => {
    return HttpResponse.json(mockInvalidRecaptchaError, { status: 400 });
  }),

  meUnauthorized: http.get(buildUrl(AUTH_ENDPOINTS.ME), () => {
    return HttpResponse.json(mockUnauthorizedError, { status: 401 });
  }),
};
