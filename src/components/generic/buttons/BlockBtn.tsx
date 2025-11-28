'use client';
import React, { useState, useEffect } from 'react';
import { useInteractions } from '@/hooks/useInteractions';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';

interface BlockBtnProps {
  userId: number;
  isBlocked?: boolean;
}

function BlockBtn({ userId, isBlocked }: BlockBtnProps) {
  const [blocked, setBlocked] = useState<boolean>(isBlocked || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showBlockModal, setShowBlockModal] = useState<boolean>(false);

  const { blockUser, unblockUser, isBlockLoading } = useInteractions();

  // Update local state when prop changes
  useEffect(() => {
    setBlocked(isBlocked || false);
  }, [isBlocked]);

  const handleBlock = async () => {
    try {
      setBlocked(true);
      await blockUser(userId);
    } catch {
      // Revert state on error
      setBlocked(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setBlocked(false);
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
      // Show confirmation modal before blocking
      setShowBlockModal(true);
    } else {
      await handleUnblock();
    }
  };

  return (
    <>
      <button
        className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
          blocked
            ? 'bg-block text-foreground border border-block hover:bg-block/90 hover:border-block/90'
            : 'bg-block/20 text-block border-block border'
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

      <ConfirmModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onConfirm={handleBlock}
        title="Block user?"
        message="They will not be able to follow you or view your posts, and you will not see posts or notifications from them."
        confirmText="Block"
        cancelText="Cancel"
        confirmButtonClass="bg-block hover:bg-block/90 text-white"
        isLoading={isBlockLoading}
      />
    </>
  );
}

export default BlockBtn;
