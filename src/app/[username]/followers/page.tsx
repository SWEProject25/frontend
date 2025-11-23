'use client';
import React from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Tabs from '@/components/generic/Tabs';
import FollowList from '@/features/profile/components/FollowList';
import { useInfiniteFollowers } from '@/hooks/interactions/useFollow';
import { useProfileByUsername } from '@/features/profile/hooks';
import Loader from '@/components/generic/Loader';

interface FollowersPageProps {
  params: Promise<{
    username: string;
  }>;
}

const tabs = [
  { title: 'Followers', value: 'followers' },
  { title: 'Following', value: 'following' },
];

export default function FollowersPage({ params }: FollowersPageProps) {
  const { username } = use(params);
  const router = useRouter();

  // Get user profile to get user ID
  const { data: profileData, isLoading: isLoadingProfile } =
    useProfileByUsername(username, true);

  const userId = profileData?.data?.User?.id;
  const displayName = profileData?.data?.name || username;

  // Fetch followers with infinite scroll
  const followersQuery = useInfiniteFollowers(userId || 0, 20);

  const handleTabClick = (value: string) => {
    if (value === 'following') {
      router.push(`/${username}/following`);
    }
  };

  const handleBack = () => {
    router.push(`/${username}`);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
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
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedValue="followers"
        onClick={handleTabClick}
        height="h-[53px]"
      />

      {/* Followers List */}
      <FollowList query={followersQuery} />
    </div>
  );
}
