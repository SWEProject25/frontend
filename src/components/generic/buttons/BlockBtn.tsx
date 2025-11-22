'use client';
import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/useInteractions';

interface BlockBtnProps {
  userId: number;
  isBlocked?: boolean;
}

function BlockBtn({ userId, isBlocked }: BlockBtnProps) {
  const [blocked, setBlocked] = useState<boolean>(isBlocked || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { blockUser, unblockUser, isBlockLoading } = useInteractions();

  // Update local state when prop changes
  useEffect(() => {
    setBlocked(isBlocked || false);
  }, [isBlocked]);

  const handleBlock = async () => {
    try {
      await blockUser(userId);
    } catch {
      // Revert state on error
      setBlocked(false);
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser(userId);
    } catch {
      // Revert state on error
      setBlocked(true);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isBlockLoading) return;

    if (!blocked) {
      setBlocked(true);
      await handleBlock();
    } else {
      setBlocked(false);
      await handleUnblock();
    }
  };

  return (
    <button
      className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
        blocked
          ? 'bg-block text-foreground border border-block hover:bg-block/90 hover:border-block/90'
          : 'bg-block/20 text-block border-block border-1'
      }`}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {blocked ? (isHovered ? 'Unblock' : 'Blocked') : 'Block'}
    </button>
  );
}

export default BlockBtn;
