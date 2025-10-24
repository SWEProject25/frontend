import {
  CreateUserDto,
  LoginDto,
  RegisterResponseDto,
  LoginResponseDto,
  SendOTPDto,
  SendOTPResponseDto,
  VerifyOTPDto,
  VerifyOTPResponseDto,
  ResendOTPDto,
  ResendOTPResponseDto,
  VerifyRecaptchaDto,
  VerifyRecaptchaResponseDto,
  UserResponse,
} from '../types/api';
import {
  AUTH_API_CONFIG,
  AUTH_ENDPOINTS,
  AUTH_CLIENT_CONFIG,
} from '../constants/api';

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

    // Provide user-friendly error messages for common errors
    if (
      statusCode === 401 &&
      errorMessage.toLowerCase().includes('invalid credentials')
    ) {
      errorMessage = 'Invalid email or password, please try again';
    }

    // Handle registration errors
    if (statusCode === 409) {
      errorMessage = errorMessage || 'User already exists';
    }

    if (statusCode === 400) {
      errorMessage =
        errorMessage ||
        'Invalid input data. Please check your information and try again.';
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

  async resendOTP(emailData: ResendOTPDto): Promise<ResendOTPResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.RESEND_OTP}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(emailData),
      }
    );

    return handleResponse<ResendOTPResponseDto>(response);
  },

  async verifyRecaptcha(
    recaptchaData: VerifyRecaptchaDto
  ): Promise<VerifyRecaptchaResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.VERIFY_RECAPTCHA}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(recaptchaData),
      }
    );

    return handleResponse<VerifyRecaptchaResponseDto>(response);
  },

  oAuthLogin(
    provider: string,
    callback: (user: UserResponse | Record<string, unknown>) => void
  ): void {
    const width = AUTH_CLIENT_CONFIG.POPUP_WIDTH;
    const height = AUTH_CLIENT_CONFIG.POPUP_HEIGHT;
    const left = AUTH_CLIENT_CONFIG.LEFT_MARGIN;
    const top = AUTH_CLIENT_CONFIG.TOP_MARGIN;
    // Select endpoint from constants when available
    let endpoint = '';
    switch (provider) {
      case 'google':
        endpoint = AUTH_ENDPOINTS.GOOGLE_OAUTH_LOGIN;
        break;
      case 'github':
        endpoint = AUTH_ENDPOINTS.GITHUB_OAUTH_LOGIN;
        break;
      default:
        endpoint = `/api/v1.0/auth/${provider}/login`;
    }

    window.open(
      `${AUTH_API_CONFIG.BASE_URL}${endpoint}`,
      'OAuthPopup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    function handleMessage(event: MessageEvent) {
      const allowedOrigins = [AUTH_API_CONFIG.BASE_URL, window.location.origin];

      if (!allowedOrigins.includes(event.origin)) return;

      const payload = event.data;
      console.log(payload);
      const { user } = payload.data.user;
      console.log(user);

      if (user) {
        callback(user);
        window.removeEventListener('message', handleMessage);
      }
    }
    window.addEventListener('message', handleMessage);
  },
};
