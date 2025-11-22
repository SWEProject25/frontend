// API Request/Response Types
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthDate: string; // Format: YYYY-MM-DD
}

export interface OnboardingStatus {
  hasCompeletedFollowing: boolean;
  hasCompeletedInterests: boolean;
  hasCompletedBirthDate: boolean;
}

export interface UserResponse {
  id: number;
  username: string;
  role: string;
  email: string;
  profile: {
    name: string;
    profileImageUrl: string | null;
    birthDate: string | null; // ISO date string
  };
  onboardingStatus?: OnboardingStatus;
}

export interface RegisterResponseDto {
  status: string;
  message: string;
  data: {
    user: UserResponse;
    onboardingStatus: OnboardingStatus;
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
    onboardingStatus: OnboardingStatus;
  };
}
export interface MeResponse {
  status: string;
  data: {
    user: UserResponse;
    onboardingStatus: OnboardingStatus;
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

export interface VerifyPasswordDto {
  password: string;
}

export interface VerifyPasswordResponseDto {
  status: string;
  message: string;
  data: {
    isValid: boolean;
  };
}

export interface UpdateEmailDto {
  email: string;
}

export interface UpdateEmailResponseDto {
  status: string;
  message: string;
}

export interface UpdateUsernameDto {
  username: string;
}

export interface UpdateUsernameResponseDto {
  status: string;
  message: string;
}
