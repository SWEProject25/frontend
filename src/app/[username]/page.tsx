// app/[username]/page.tsx
'use client';
import React from 'react';

import Breadcrumb from '@/components/ui/Breadcrumb';
import { userData } from '@/features/settings/constants/USER_DATA';
import { SearchIcon } from '@/components/ui/icons';

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage: React.FC<UserPageProps> = ({ params }) => {
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
        <SearchIcon className="w-5 h-6 text-text-primary" />
      </div>
      <h1 className="text-2xl font-bold">@{username}&apos;s Profile</h1>
      <p>Welcome to {username}&apos;s page!</p>
    </main>
  );
};

export default UserPage;
