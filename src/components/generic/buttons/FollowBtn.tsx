'use client';
import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/useInteractions';

interface FollowBtnProps {
  userId: number;
  isFollowed?: boolean;
}

function FollowBtn({ userId, isFollowed }: FollowBtnProps) {
  const [followed, setFollowed] = useState<boolean>(isFollowed || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [followClicked, setFollowClicked] = useState<boolean>(false);

  const { followUser, unfollowUser, isFollowLoading } = useInteractions();

  // Update local state when prop changes
  useEffect(() => {
    setFollowed(isFollowed || false);
  }, [isFollowed]);

  const handleFollow = async () => {
    try {
      await followUser(userId);
    } catch {
      // Revert state on error
      setFollowed(false);
      setFollowClicked(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
    } catch {
      // Revert state on error
      setFollowed(true);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFollowLoading) return;

    if (!followed) {
      setFollowClicked(true);
      setFollowed(true);
      await handleFollow();
    } else {
      setFollowed(false);
      setFollowClicked(false);
      await handleUnfollow();
    }
  };

  return (
    <button
      className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
        followed
          ? followClicked
            ? 'bg-background text-background hover:bg-muted'
            : 'bg-background text-foreground border border-border hover:bg-block/20 hover:text-block hover:border-block'
          : 'bg-foreground text-background hover:bg-muted'
      }`}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setFollowClicked(false);
      }}
    >
      {followed
        ? isHovered
          ? followClicked
            ? 'Following'
            : 'Unfollow'
          : 'Following'
        : 'Follow'}
    </button>
  );
}

export default FollowBtn;
