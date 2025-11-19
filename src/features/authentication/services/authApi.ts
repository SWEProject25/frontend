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
  VerifyPasswordDto,
  VerifyPasswordResponseDto,
  UpdateEmailDto,
  UpdateEmailResponseDto,
  UpdateUsernameDto,
  UpdateUsernameResponseDto,
  UserResponse,
  MeResponse,
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

let cachedUser: UserResponse | null = null;
let cachedAt = 0;
const CURRENT_USER_TTL = 5 * 60 * 1000; // 5 minutes

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

    const data = await handleResponse<RegisterResponseDto>(response);

    const user = data?.data?.user;
    if (user) {
      cachedUser = user;
      cachedAt = Date.now();
    }

    return data;
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

    const data = await handleResponse<LoginResponseDto>(response);

    const user = data?.data?.user;
    if (user) {
      cachedUser = user;
      cachedAt = Date.now();
    }

    return data;
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

    cachedUser = null;
    cachedAt = 0;
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

  async verifyPassword(
    passwordData: VerifyPasswordDto
  ): Promise<VerifyPasswordResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.VERIFY_PASSWORD}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for HTTPOnly cookies
        body: JSON.stringify(passwordData),
      }
    );

    return handleResponse<VerifyPasswordResponseDto>(response);
  },

  async forgotPassword(payload: {
    email: string;
    type?: string;
  }): Promise<{ status: string; message: string }> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.FORGOT_PASSWORD}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<{ status: string; message: string }>(response);
  },

  async resetPassword(payload: {
    userId: number;
    token: string;
    newPassword: string;
    email?: string;
  }): Promise<{ status: string; message: string }> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.RESET_PASSWORD}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<{ status: string; message: string }>(response);
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

  async getCurrentUser(): Promise<UserResponse> {
    // Return cached user when available and fresh
    if (cachedUser && Date.now() - cachedAt < CURRENT_USER_TTL) {
      return Promise.resolve(cachedUser);
    }

    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.ME}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    const result = await handleResponse<MeResponse>(response);

    let user: UserResponse | undefined;

    if (result.status === 'success') {
      user = result.data.user;
    }
    if (user) {
      cachedUser = user;
      cachedAt = Date.now();
      return cachedUser;
    }

    throw new ApiError('Failed to parse current user', 500, result);
  },

  oAuthLogin(provider: string, callback: (user: UserResponse) => void): void {
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
      const { user } = payload.data;

      if (user) {
        callback(user as UserResponse);
        window.removeEventListener('message', handleMessage);
      }
    }
    window.addEventListener('message', handleMessage);
  },

  async updateEmail(
    emailData: UpdateEmailDto
  ): Promise<UpdateEmailResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.UPDATE_EMAIL}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(emailData),
      }
    );

    const data = await handleResponse<UpdateEmailResponseDto>(response);

    const user = data?.data?.user;
    if (user) {
      cachedUser = user;
      cachedAt = Date.now();
    }

    return data;
  },

  async updateUsername(
    usernameData: UpdateUsernameDto
  ): Promise<UpdateUsernameResponseDto> {
    const response = await fetch(
      `${AUTH_API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.UPDATE_USERNAME}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(usernameData),
      }
    );

    const data = await handleResponse<UpdateUsernameResponseDto>(response);

    const user = data?.data?.user;
    if (user) {
      cachedUser = user;
      cachedAt = Date.now();
    }

    return data;
  },
};
