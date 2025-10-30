import {
  UserResponse,
  LoginDto,
  CreateUserDto,
  SendOTPDto,
  VerifyOTPDto,
  ResendOTPDto,
} from './api';

// Auth Store Types
export interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: CreateUserDto) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (emailData: SendOTPDto) => Promise<void>;
  verifyOTP: (otpData: VerifyOTPDto) => Promise<void>;
  resendOTP: (emailData: ResendOTPDto) => Promise<void>;
  oAuthLogin: (
    provider: string,
    onSuccess?: (user: UserResponse) => void
  ) => void;
}

export interface AuthStore extends AuthState, AuthActions {}
