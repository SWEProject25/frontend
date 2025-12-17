'use client';
import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';
import { useFollowersYouKnow } from '@/hooks/interactions';

interface FollowStatsProps {
  followingCount: number;
  followersCount: number;
  username: string;
  userId: number;
  isMine: boolean;
}

const FollowStats = ({
  followingCount,
  followersCount,
  username,
  userId,
  isMine,
}: FollowStatsProps) => {
  // Only fetch followers you know for other profiles
  const { data: followersYouKnowData } = useFollowersYouKnow(
    userId,
    { page: 1, limit: 3 },
    !isMine // Only enable when not viewing own profile
  );

  const followersYouKnow = followersYouKnowData?.data || [];
  const totalFollowersYouKnow = followersYouKnowData?.metadata?.totalItems || 0;
  const showFollowersYouKnow = !isMine && totalFollowersYouKnow > 0;

  // Get display names for the first 2 followers
  const getFollowersText = () => {
    if (followersYouKnow.length === 0) return '';

    const names = followersYouKnow.slice(0, 2).map((f) => f.displayName);
    const remaining = totalFollowersYouKnow - 2;

    if (totalFollowersYouKnow === 1) {
      return `Followed by ${names[0]}`;
    } else if (totalFollowersYouKnow === 2) {
      return `Followed by ${names[0]} and ${names[1]}`;
    }
    // totalFollowersYouKnow > 2
    return `Followed by ${names[0]}, ${names[1]} and ${remaining} ${remaining === 1 ? 'other you follow' : 'others you follow'}`;
  };

  return (
    <div
      className="flex flex-col gap-3 w-full"
      data-testid="profile-follow-stats"
    >
      {/* Following and Followers counts */}
      <div className="flex flex-row flex-wrap items-baseline gap-x-2 sm:gap-x-3 w-full min-h-5">
        <Link
          href={`/${username}/following`}
          className="flex flex-row items-baseline gap-1 hover:underline cursor-pointer"
          data-testid="profile-following-stat"
        >
          <span
            className="font-inter font-bold text-sm sm:text-base text-text-active"
            data-testid="profile-following-count"
          >
            {followingCount}
          </span>
          <span className="font-inter text-sm sm:text-base text-text-placeholder">
            Following
          </span>
        </Link>
        <Link
          href={`/${username}/followers`}
          className="flex flex-row items-baseline gap-1 hover:underline cursor-pointer"
          data-testid="profile-followers-stat"
        >
          <span
            className="font-inter font-bold text-sm sm:text-base text-text-active"
            data-testid="profile-followers-count"
          >
            {followersCount}
          </span>
          <span className="font-inter text-sm sm:text-base text-text-placeholder">
            Followers
          </span>
        </Link>
      </div>

      {/* Followers you know preview */}
      {showFollowersYouKnow && (
        <Link
          href={`/${username}/followers-you-know`}
          className="flex items-center gap-2 hover:underline cursor-pointer group"
          data-testid="profile-followers-you-know"
        >
          {/* Avatar stack */}
          <div className="flex items-center -space-x-2">
            {followersYouKnow.slice(0, 3).map((follower, index) => (
              <div
                key={follower.id}
                className="relative"
                style={{ zIndex: 3 - index }}
              >
                <Avatar
                  avatarImage={follower.profileImageUrl ?? null}
                  name={follower.displayName}
                  size="xs"
                  position="relative"
                  className="border-2 border-background"
                />
              </div>
            ))}
          </div>

          {/* Text */}
          <span className="text-sm text-text-secondary group-hover:text-text-active transition-colors">
            {getFollowersText()}
          </span>
        </Link>
      )}
    </div>
  );
};

export default FollowStats;
