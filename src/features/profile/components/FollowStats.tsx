'use client';
import React from 'react';
import Link from 'next/link';

interface FollowStatsProps {
  followingCount: number;
  followersCount: number;
  username: string;
}

const FollowStats = ({
  followingCount,
  followersCount,
  username,
}: FollowStatsProps) => {
  return (
    <div
      className="flex flex-row flex-wrap items-baseline gap-x-2 sm:gap-x-3 w-full min-h-5"
      data-testid="profile-follow-stats"
    >
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
  );
};

export default FollowStats;
