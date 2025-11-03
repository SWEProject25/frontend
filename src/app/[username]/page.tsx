'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { SearchIcon } from '@/components/ui/icons';
import ProfileContainer from '@/features/profile/components/ProfileContainer';
import Button from '@/components/ui/Button';
import TabView from '@/features/profile/components/TabView';
import { use } from 'react';
import { useProfileByUsername } from '@/features/profile/hooks';
import { useMyProfile } from '@/features/profile/hooks';
import { useAuthStore } from '@/features/authentication/store/authStore';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

const UserPage = ({ params }: UserPageProps) => {
  const { username } = use(params);

  const currentUser = useAuthStore((s) => s.user);

  const useMy = Boolean(currentUser && currentUser.username === username);

  const myProfileQuery = useMyProfile();
  const {
    data: profileDataByUsername,
    isLoading: isLoadingByUsername,
    error: errorByUsername,
  } = useProfileByUsername(username, !useMy);

  const profileData = useMy ? myProfileQuery.data : profileDataByUsername;
  const isLoading = useMy ? myProfileQuery.isLoading : isLoadingByUsername;
  const error = useMy ? myProfileQuery.error : errorByUsername;

  const handleBack = () => {
    window.history.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="flex flex-col w-full min-h-screen">
        <div className="flex flex-row justify-between items-center px-4">
          <Breadcrumb
            title={`${username}'s Profile`}
            subtitle="Loading..."
            onBack={handleBack}
            showArrow={true}
          />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">Loading profile...</div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !profileData) {
    return (
      <main className="flex flex-col w-full min-h-screen">
        <div className="flex flex-row justify-between items-center px-4">
          <Breadcrumb
            title={`${username}'s Profile`}
            subtitle="Not Found"
            onBack={handleBack}
            showArrow={true}
          />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-text-secondary">
            {error?.message || 'Profile not found'}
          </div>
        </div>
      </main>
    );
  }

  const profile = profileData.data;

  return (
    <main className="flex flex-col w-full min-h-screen">
      <div className="flex flex-row justify-between items-center px-4">
        <Breadcrumb
          title={`${profile.name}'s Profile`}
          subtitle={`@${profile.User.username}`}
          onBack={handleBack}
          showArrow={true}
        />
        <Button variant="ghost" size="md" shape="circle">
          <SearchIcon className="w-5 h-6 text-text-primary" />
        </Button>
      </div>
      <div className="flex flex-col w-full">
        <ProfileContainer profileData={profile} isMine={useMy} />
        <TabView />
      </div>
    </main>
  );
};

export default UserPage;
