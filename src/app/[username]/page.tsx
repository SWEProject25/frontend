'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { SearchIcon } from '@/components/ui/icons';
import ProfileContainer from '@/features/profile/components/ProfileContainer';
import Button from '@/components/ui/Button';
import TabView from '@/features/profile/components/TabView';
import BlockedUserWarning from '@/features/profile/components/BlockedUserWarning';
import { useProfileStore } from '@/features/profile';
import { useProfileContext } from './ProfileProvider';
import { useAuthStore } from '@/features/authentication/store/authStore';

const UserPage = () => {
  const { profile, username } = useProfileContext();
  const { setCurrentProfile } = useProfileStore();
  const currentUser = useAuthStore((s) => s.user);
  const isMine = Boolean(currentUser && currentUser.username === username);
  const [showBlockedPosts, setShowBlockedPosts] = useState(false);

  useEffect(() => {
    setCurrentProfile(profile);
    return () => {
      setCurrentProfile(null);
    };
  }, [profile, setCurrentProfile]);

  const handleBack = () => {
    window.history.back();
  };

  if (!profile) {
    return null;
  }

  return (
    <main className="flex flex-col" data-testid="profile-page">
      <div
        className="flex flex-row justify-between items-center px-4 sticky top-0 bg-background/90 z-10"
        data-testid="profile-header"
      >
        <Breadcrumb
          data-testid="profile-breadcrumb"
          title={`${profile.name}'s Profile`}
          subtitle={`@${profile.User.username}`}
          onBack={handleBack}
          showArrow={true}
        />
        <Button
          data-testid="profile-search-button"
          variant="ghost"
          size="md"
          shape="circle"
        >
          <SearchIcon className="w-5 h-6 text-text-primary" />
        </Button>
      </div>
      <div className="flex flex-col">
        <ProfileContainer profileData={profile} isMine={isMine} />
        {profile.is_blocked_by_me && !showBlockedPosts ? (
          <BlockedUserWarning
            username={profile.User.username}
            onViewPosts={() => setShowBlockedPosts(true)}
          />
        ) : (
          <TabView />
        )}
      </div>
    </main>
  );
};

export default UserPage;
