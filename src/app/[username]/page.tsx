'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { SearchIcon } from '@/components/ui/icons';
import ProfileContainer from '@/features/profile/components/ProfileContainer';
import Button from '@/components/ui/Button';
import TabView from '@/features/profile/components/TabView';
import { use } from 'react';
import { useProfileByUsername } from '@/features/profile/hooks';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

const UserPage = ({ params }: UserPageProps) => {
  const { username } = use(params);

  const {
    data: profileData,
    isLoading,
    error,
  } = useProfileByUsername(username);

  const handleBack = () => {
    console.log('Back button clicked');
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="flex flex-col">
        <div className="flex flex-row justify-between items-center mr-4">
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
      <main className="flex flex-col">
        <div className="flex flex-row justify-between items-center mr-4">
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
    <main className="flex flex-col">
      <div className="flex flex-row justify-between items-center mr-4">
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
      <div className="flex flex-col w-full max-w-[600px] mx-auto">
        <ProfileContainer profileData={profile} />
        <TabView />
      </div>
    </main>
  );
};

export default UserPage;
