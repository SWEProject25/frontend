'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { userData } from '@/features/settings/constants/USER_DATA';
import { SearchIcon } from '@/components/ui/icons';
import ProfileContainer from '@/features/profile/components/ProfileContainer';
import Button from '@/components/ui/Button';
import TabView from '@/features/profile/components/TabView';
import { use } from 'react';

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

const UserPage = ({ params }: UserPageProps) => {
  const { username } = use(params);
  const handleBack = () => {
    console.log('Back button clicked');
  };

  return (
    <main className="flex flex-col">
      <div className="flex flex-row justify-between items-center mr-4">
        <Breadcrumb
          title={`${username}'s Profile`}
          subtitle={userData.username}
          onBack={handleBack}
          showArrow={true}
        />
        <Button variant="ghost" size="md" shape="circle">
          <SearchIcon className="w-5 h-6 text-text-primary" />
        </Button>
      </div>
      <div className="flex flex-col w-full max-w-[600px] mx-auto">
        <ProfileContainer userData={userData} />
        <TabView />
      </div>
    </main>
  );
};

export default UserPage;
