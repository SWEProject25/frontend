'use client';
import React, {
  createContext,
  useContext,
  ReactNode,
  use,
  useMemo,
} from 'react';
import { useProfileByUsername, useMyProfile } from '@/features/profile/hooks';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { UserProfile } from '@/features/profile/types/api';
import Loader from '@/components/generic/Loader';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  username: string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  readonly children: ReactNode;
  readonly params: Promise<{ username: string }>;
}

export function ProfileProvider({ children, params }: ProfileProviderProps) {
  const { username } = use(params);
  const currentUser = useAuthStore((s) => s.user);
  const useMy = Boolean(currentUser?.username === username);

  const myProfileQuery = useMyProfile();
  const {
    data: profileDataByUsername,
    isLoading: isLoadingByUsername,
    error: errorByUsername,
  } = useProfileByUsername(username, !useMy);

  const profile = useMy
    ? myProfileQuery.data?.data || null
    : profileDataByUsername?.data || null;

  const isLoading = useMy ? myProfileQuery.isLoading : isLoadingByUsername;

  const error = useMy ? myProfileQuery.error : errorByUsername;

  const contextValue = useMemo(
    () => ({ profile, isLoading, error, username }),
    [profile, isLoading, error, username]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold text-text-active mb-2">
          Error Loading Profile
        </h2>
        <p className="text-text-secondary">
          {error.message || 'Failed to load profile data'}
        </p>
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
