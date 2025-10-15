import {
  CreateUserDto,
  LoginDto,
  RegisterResponseDto,
  LoginResponseDto,
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
    // Since logout is handled by clearing HTTPOnly cookies on the server,
    // we just need to clear local state
    // The actual logout endpoint would be called here if it existed
    return Promise.resolve();
  },
};
