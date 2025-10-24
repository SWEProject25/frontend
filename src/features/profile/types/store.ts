import { UserProfile } from './api';

export interface ProfileStore {
  // State
  currentProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}
