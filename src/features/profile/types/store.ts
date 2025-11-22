import { UserProfile } from './api';

export interface ProfileStore {
  // State
  currentProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  selectedTab: string;

  // Actions
  setCurrentProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
  actions: {
    selectTab: (tab: string) => void;
  };
}
