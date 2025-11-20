import React from 'react';

interface FollowStatsProps {
  followingCount: number;
  followersCount: number;
}

const FollowStats = ({ followingCount, followersCount }: FollowStatsProps) => {
  return (
    <div className="flex flex-row flex-wrap items-baseline gap-x-2 sm:gap-x-3 w-full min-h-[20px]">
      <div className="flex flex-row items-baseline gap-1">
        <span className="font-inter font-bold text-sm sm:text-base text-text-active">
          {followingCount}
        </span>
        <span className="font-inter text-sm sm:text-base text-text-placeholder">
          Following
        </span>
      </div>
      <div className="flex flex-row items-baseline gap-1">
        <span className="font-inter font-bold text-sm sm:text-base text-text-active">
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
