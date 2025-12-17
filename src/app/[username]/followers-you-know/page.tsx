'use client';
import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Tabs, GenericUserList } from '@/components/generic';
import { useInfiniteFollowersYouKnow } from '@/hooks/interactions/useFollow';
import { useProfileByUsername } from '@/features/profile/hooks';
import { useAuthStore } from '@/features/authentication/store/authStore';
import Loader from '@/components/generic/Loader';

interface FollowersYouKnowPageProps {
  readonly params: Promise<{
    username: string;
  }>;
}

const tabs = [
  { title: 'Followers', value: 'followers' },
  { title: 'Following', value: 'following' },
  { title: 'Followers you know', value: 'followers-you-know' },
];

export default function FollowersYouKnowPage({
  params,
}: FollowersYouKnowPageProps) {
  const { username } = use(params);
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);

  // Get user profile to get user ID
  const { data: profileData, isLoading: isLoadingProfile } =
    useProfileByUsername(username, true);

  const userId = profileData?.data?.User?.id;
  const displayName = profileData?.data?.name || username;
  const isOwnProfile = currentUser?.username === username;

  // Redirect to followers page if viewing own profile
  useEffect(() => {
    if (!isLoadingProfile && isOwnProfile) {
      router.replace(`/${username}/followers`);
    }
  }, [isOwnProfile, isLoadingProfile, username, router]);

  // Fetch followers you know with infinite scroll
  const followersYouKnowQuery = useInfiniteFollowersYouKnow(userId || 0, 20);

  const handleTabClick = (value: string) => {
    if (value === 'followers') {
      router.push(`/${username}/followers`);
    } else if (value === 'following') {
      router.push(`/${username}/following`);
    }
  };

  const handleBack = () => {
    router.push(`/${username}`);
  };

  if (isLoadingProfile || isOwnProfile) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        data-testid="followers-you-know-page-loading"
      >
        <Loader data-testid="followers-you-know-page-loader" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" data-testid="followers-you-know-page">
      {/* Breadcrumb */}
      <Breadcrumb
        title={displayName}
        subtitle={`@${username}`}
        onBack={handleBack}
        showArrow={true}
        data-testid="followers-you-know-breadcrumb"
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedValue="followers-you-know"
        onClick={handleTabClick}
        height="h-[53px]"
        data-testid="followers-you-know-tabs"
      />

      {/* Followers You Know List */}
      <GenericUserList
        query={followersYouKnowQuery}
        data-testid="followers-you-know-list"
      />
    </div>
  );
}
