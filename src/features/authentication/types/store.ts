import { UserResponse } from './api';

// Auth State
export interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth Actions
export interface AuthActions {
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

// Combined Auth Store
export type AuthStore = AuthState & AuthActions;
