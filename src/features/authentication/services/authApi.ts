import {
  CreateUserDto,
  LoginDto,
  RegisterResponseDto,
  LoginResponseDto,
  SendOTPDto,
  SendOTPResponseDto,
  VerifyOTPDto,
  VerifyOTPResponseDto,
} from '../types/api';
import { AUTH_API_CONFIG, AUTH_ENDPOINTS } from '../constants/api';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    const statusCode = response.status;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const authApi = {
  async register(userData: CreateUserDto): Promise<RegisterResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.REGISTER}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(userData),
      }
    );

    return handleResponse<RegisterResponseDto>(response);
  },

  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(credentials),
      }
    );

    return handleResponse<LoginResponseDto>(response);
  },

  async logout(): Promise<void> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
      }
    );

    if (!response.ok) {
      let errorMessage = 'Logout failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new ApiError(errorMessage, response.status);
    }

    // No need to parse response body for logout endpoint
  },

  async sendOTP(emailData: SendOTPDto): Promise<SendOTPResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.VERIFICATION_OTP}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(emailData),
      }
    );

    return handleResponse<SendOTPResponseDto>(response);
  },

  async verifyOTP(otpData: VerifyOTPDto): Promise<VerifyOTPResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.VERIFY_OTP}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(otpData),
      }
    );

    return handleResponse<VerifyOTPResponseDto>(response);
  },
};
