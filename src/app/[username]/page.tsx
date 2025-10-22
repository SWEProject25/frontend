'use client';
import React from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { userData } from '@/features/settings/constants/USER_DATA';
import { SearchIcon } from '@/components/ui/icons';
import ProfileContainer from '@/features/profile/components/ProfileContainer';
import Button from '@/components/ui/Button';
interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = ({ params }: UserPageProps) => {
  const { username } = params;
  const handleBack = () => {
    console.log('Back button clicked');
  };

  return (
    <main className="">
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
      <ProfileContainer userData={userData} />
    </main>
  );
};

export default UserPage;
