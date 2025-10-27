// API Request/Response Types
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthDate: string; // Format: YYYY-MM-DD
}

export interface UserResponse {
  username: string;
  email: string;
  role: string;
  name: string;
  birthDate?: string;
  profileImageUrl?: string | null;
  bannerImageUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  createdAt?: string;
}

export interface RegisterResponseDto {
  status: string;
  message: string;
  data: {
    user: UserResponse;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  status: string;
  message: string;
  data: {
    user: UserResponse;
  };
}

export interface SendOTPDto {
  email: string;
}

export interface SendOTPResponseDto {
  status: string;
  message: string;
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export interface VerifyOTPResponseDto {
  status: string;
  message: string;
}

export interface ResendOTPDto {
  email: string;
}

export interface ResendOTPResponseDto {
  status: string;
  message: string;
}

export interface VerifyRecaptchaDto {
  recaptcha: string;
}

export interface VerifyRecaptchaResponseDto {
  status: string;
  message: string;
}
