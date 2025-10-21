// API Request/Response Types
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponseDto {
  status: string;
  message: string;
  user: UserResponse;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  status: string;
  message: string;
  user: UserResponse;
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
