import React from 'react';

interface FollowStatsProps {
  followingCount: number;
  followersCount: number;
}

const FollowStats = ({ followingCount, followersCount }: FollowStatsProps) => {
  return (
    <div
      className="flex flex-row flex-wrap items-baseline gap-x-2 sm:gap-x-3 w-full min-h-5"
      data-testid="profile-follow-stats"
    >
      <div
        className="flex flex-row items-baseline gap-1"
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
      </div>
      <div
        className="flex flex-row items-baseline gap-1"
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
      </div>
    </div>
  );
};

export default FollowStats;
