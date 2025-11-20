import { UserResponse } from './api';

// Auth State
export interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  passwordVerifiedAt: number | null; // Timestamp when password was verified
}

// Auth Actions
export interface AuthActions {
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setPasswordVerified: (verified: boolean) => void;
  checkPasswordVerification: () => boolean;
}

// Combined Auth Store
export type AuthStore = AuthState & AuthActions;
