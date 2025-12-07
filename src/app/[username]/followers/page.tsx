'use client';
import React from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Tabs, GenericUserList } from '@/components/generic';
import { useInfiniteFollowers } from '@/hooks/interactions/useFollow';
import { useProfileByUsername } from '@/features/profile/hooks';
import { useAuthStore } from '@/features/authentication/store/authStore';
import Loader from '@/components/generic/Loader';

interface FollowersPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function FollowersPage({ params }: FollowersPageProps) {
  const { username } = use(params);
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);

  // Get user profile to get user ID
  const { data: profileData, isLoading: isLoadingProfile } =
    useProfileByUsername(username, true);

  const isOwnProfile = currentUser?.username === username;

  const tabs = React.useMemo(
    () => [
      { title: 'Followers', value: 'followers' },
      { title: 'Following', value: 'following' },
      ...(isOwnProfile
        ? []
        : [{ title: 'Followers you know', value: 'followers-you-know' }]),
    ],
    [isOwnProfile]
  );

  const userId = profileData?.data?.User?.id;
  const displayName = profileData?.data?.name || username;

  // Fetch followers with infinite scroll
  const followersQuery = useInfiniteFollowers(userId || 0, 20);

  const handleTabClick = (value: string) => {
    if (value === 'following') {
      router.push(`/${username}/following`);
    } else if (value === 'followers-you-know') {
      router.push(`/${username}/followers-you-know`);
    }
  };

  const handleBack = () => {
    router.push(`/${username}`);
  };

  if (isLoadingProfile) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-testid="followers-page-loading"
      >
        <Loader data-testid="followers-page-loader" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" data-testid="followers-page">
      {/* Breadcrumb */}
      <Breadcrumb
        title={displayName}
        subtitle={`@${username}`}
        onBack={handleBack}
        showArrow={true}
        data-testid="followers-breadcrumb"
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedValue="followers"
        onClick={handleTabClick}
        height="h-[53px]"
        data-testid="followers-tabs"
      />

      {/* Followers List */}
      <GenericUserList query={followersQuery} data-testid="followers-list" />
    </div>
  );
}
