'use client';
import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/useInteractions';

interface FollowBtnProps {
  userId: number;
  isFollowed?: boolean;
  onFollowChange?: (userId: number, isFollowed: boolean) => void;
}

function FollowBtn({ userId, isFollowed, onFollowChange }: FollowBtnProps) {
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
      onFollowChange?.(userId, true);
    } catch {
      // Revert state on error
      setFollowed(false);
      setFollowClicked(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser(userId);
      onFollowChange?.(userId, false);
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
      setFollowClicked(true);
      setFollowed(true);
      await handleFollow();
    } else {
      setFollowed(false);
      setFollowClicked(false);
      setFollowClicked(false);
      await handleUnfollow();
    }
  };

  return (
    <button
      className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
        followed
          ? 'bg-background text-foreground border border-border hover:bg-error/10 hover:text-error hover:border-error'
          : 'bg-foreground text-background hover:bg-foreground/90'
      }`}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {followed ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
}

export default FollowBtn;
