import type { UserResponse, OnboardingStatus } from '../types/api';

/**
 * Mock authentication data for testing
 */

// Mock onboarding status for different test scenarios
export const mockCompletedOnboardingStatus: OnboardingStatus = {
  hasCompletedBirthDate: true,
  hasCompeletedInterests: true,
  hasCompeletedFollowing: true,
};

export const mockIncompleteOnboardingStatus: OnboardingStatus = {
  hasCompletedBirthDate: false,
  hasCompeletedInterests: false,
  hasCompeletedFollowing: false,
};

export const mockPartialOnboardingStatus: OnboardingStatus = {
  hasCompletedBirthDate: true,
  hasCompeletedInterests: false,
  hasCompeletedFollowing: false,
};

export const mockInterestsCompletedOnboardingStatus: OnboardingStatus = {
  hasCompletedBirthDate: true,
  hasCompeletedInterests: true,
  hasCompeletedFollowing: false,
};

// Mock user data
export const mockAuthUser: UserResponse = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  role: 'user',
  profile: {
    name: 'Test User',
    profileImageUrl: 'https://i.pravatar.cc/150?img=8',
    birthDate: '1995-06-15',
  },
  onboardingStatus: mockCompletedOnboardingStatus,
};

export const mockAuthUser2: UserResponse = {
  id: 2,
  email: 'jane@example.com',
  username: 'janedoe',
  role: 'user',
  profile: {
    name: 'Jane Doe',
    profileImageUrl: 'https://i.pravatar.cc/150?img=5',
    birthDate: '1992-03-20',
  },
  onboardingStatus: mockCompletedOnboardingStatus,
};

export const mockAdminUser: UserResponse = {
  id: 3,
  email: 'admin@example.com',
  username: 'admin',
  role: 'admin',
  profile: {
    name: 'Admin User',
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
    birthDate: '1988-11-10',
  },
  onboardingStatus: mockCompletedOnboardingStatus,
};

// Mock responses
export const mockLoginResponse = {
  status: 'success',
  message: 'Login successful',
  data: {
    user: mockAuthUser,
    onboardingStatus: mockCompletedOnboardingStatus,
  },
};

export const mockRegisterResponse = {
  status: 'success',
  message: 'Registration successful',
  data: {
    user: mockAuthUser,
    onboardingStatus: mockIncompleteOnboardingStatus,
  },
};

export const mockLogoutResponse = {
  status: 'success',
  message: 'Logout successful',
};

export const mockSendOTPResponse = {
  status: 'success',
  message: 'OTP sent successfully',
};

export const mockVerifyOTPResponse = {
  status: 'success',
  message: 'OTP verified successfully',
};

export const mockResendOTPResponse = {
  status: 'success',
  message: 'OTP resent successfully',
};

export const mockVerifyRecaptchaResponse = {
  status: 'success',
  message: 'Recaptcha verified',
};

export const mockForgotPasswordResponse = {
  status: 'success',
  message: 'Password reset email sent',
};

export const mockResetPasswordResponse = {
  status: 'success',
  message: 'Password reset successful',
};

export const mockMeResponse = {
  status: 'success',
  data: {
    user: mockAuthUser,
    onboardingStatus: mockCompletedOnboardingStatus,
  },
};

// Error responses
export const mockInvalidCredentialsError = {
  message: 'Invalid credentials',
};

export const mockUserExistsError = {
  message: 'User already exists',
};

export const mockInvalidEmailError = {
  message: 'Invalid email format',
};

export const mockInvalidOTPError = {
  message: 'Invalid OTP',
};

export const mockInvalidRecaptchaError = {
  message: 'Invalid recaptcha token',
};

export const mockUnauthorizedError = {
  message: 'Unauthorized',
};

export const mockUserNotFoundError = {
  message: 'User not found',
};

export const mockInvalidTokenError = {
  message: 'Invalid or expired token',
};

// Helper to get user by email
export const getMockUserByEmail = (email: string): UserResponse | undefined => {
  const users = [mockAuthUser, mockAuthUser2, mockAdminUser];
  return users.find((user) => user.email === email);
};

// Helper to get user by username
export const getMockUserByUsername = (
  username: string
): UserResponse | undefined => {
  const users = [mockAuthUser, mockAuthUser2, mockAdminUser];
  return users.find((user) => user.username === username);
};

// Additional mock users for testing different onboarding states
export const mockNewUser: UserResponse = {
  id: 4,
  email: 'newuser@example.com',
  username: 'newuser',
  role: 'user',
  profile: {
    name: 'New User',
    profileImageUrl: null,
    birthDate: null,
  },
  onboardingStatus: mockIncompleteOnboardingStatus,
};

export const mockPartialOnboardingUser: UserResponse = {
  id: 5,
  email: 'partial@example.com',
  username: 'partialuser',
  role: 'user',
  profile: {
    name: 'Partial User',
    profileImageUrl: 'https://i.pravatar.cc/150?img=15',
    birthDate: '1990-05-10',
  },
  onboardingStatus: mockPartialOnboardingStatus,
};

export const mockInterestsCompletedUser: UserResponse = {
  id: 6,
  email: 'interests@example.com',
  username: 'interestsuser',
  role: 'user',
  profile: {
    name: 'Interests User',
    profileImageUrl: 'https://i.pravatar.cc/150?img=20',
    birthDate: '1993-08-22',
  },
  onboardingStatus: mockInterestsCompletedOnboardingStatus,
};

// OAuth mock responses (for testing OAuth login with different onboarding states)
export const mockOAuthNewUserResponse = {
  status: 'success',
  message: 'OAuth login successful',
  data: {
    user: mockNewUser,
    onboardingStatus: mockIncompleteOnboardingStatus,
  },
};

export const mockOAuthExistingUserResponse = {
  status: 'success',
  message: 'OAuth login successful',
  data: {
    user: mockAuthUser,
    onboardingStatus: mockCompletedOnboardingStatus,
  },
};
