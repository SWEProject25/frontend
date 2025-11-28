'use client';
import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/useInteractions';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';

interface FollowBtnProps {
  userId: number;
  isFollowed?: boolean;
  onFollowChange?: (userId: number, isFollowed: boolean) => void;
}

function FollowBtn({ userId, isFollowed, onFollowChange }: FollowBtnProps) {
  const [followed, setFollowed] = useState<boolean>(isFollowed || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState<boolean>(false);

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
    }
  };

  const handleUnfollow = async () => {
    try {
      setFollowed(false);
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
      setFollowed(true);
      await handleFollow();
    } else {
      // Show confirmation modal before unfollowing
      setShowUnfollowModal(true);
    }
  };

  return (
    <>
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

      <ConfirmModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={handleUnfollow}
        title="Unfollow user?"
        message="Their posts will no longer show up in your home timeline. You can still view their profile, unless their posts are protected."
        confirmText="Unfollow"
        cancelText="Cancel"
        isLoading={isFollowLoading}
      />
    </>
  );
}

export default FollowBtn;
