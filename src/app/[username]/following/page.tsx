'use client';
import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Tabs, GenericUserList } from '@/components/generic';
import { useInfiniteFollowing } from '@/hooks/interactions/useFollow';
import { useProfileByUsername } from '@/features/profile/hooks';
import { useAuthStore } from '@/features/authentication/store/authStore';
import Loader from '@/components/generic/Loader';

interface FollowingPageProps {
  readonly params: Promise<{
    username: string;
  }>;
}

export default function FollowingPage({ params }: FollowingPageProps) {
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

  // Fetch following with infinite scroll
  const followingQuery = useInfiniteFollowing(userId || 0, 20);

  const handleTabClick = (value: string) => {
    if (value === 'followers') {
      router.push(`/${username}/followers`);
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
        data-testid="following-page-loading"
      >
        <Loader data-testid="following-page-loader" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" data-testid="following-page">
      {/* Breadcrumb */}
      <Breadcrumb
        title={displayName}
        subtitle={`@${username}`}
        onBack={handleBack}
        showArrow={true}
        data-testid="following-breadcrumb"
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedValue="following"
        onClick={handleTabClick}
        height="h-[53px]"
        data-testid="following-tabs"
      />

      {/* Following List */}
      <GenericUserList query={followingQuery} data-testid="following-list" />
    </div>
  );
}
