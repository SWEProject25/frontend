'use client';
import React, { useState, useEffect } from 'react';
import { MuteIcon, UnMuteIcon } from '@/components/ui/icons';
import { useInteractions } from '@/hooks/useInteractions';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';

interface MuteBtnProps {
  userId: number;
  isMuted?: boolean;
}

function MuteBtn({ userId, isMuted }: MuteBtnProps) {
  const [muted, setMuted] = useState<boolean>(isMuted || false);
  const [showMuteModal, setShowMuteModal] = useState<boolean>(false);

  const { muteUser, unmuteUser, isMuteLoading } = useInteractions();

  // Update local state when prop changes
  useEffect(() => {
    setMuted(isMuted || false);
  }, [isMuted]);

  const handleMute = async () => {
    try {
      setMuted(true);
      await muteUser(userId);
    } catch {
      // Revert state on error
      setMuted(false);
    }
  };

  const handleUnmute = async () => {
    try {
      setMuted(false);
      await unmuteUser(userId);
    } catch {
      // Revert state on error
      setMuted(true);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isMuteLoading) return;

    if (!muted) {
      // Show confirmation modal before muting
      setShowMuteModal(true);
    } else {
      await handleUnmute();
    }
  };

  return (
    <>
      <button
        type="button"
        className={`p-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
          muted
            ? 'bg-background text-block border-block border hover:bg-block/10'
            : 'bg-background text-primary hover:bg-primary/10 border-primary/40 border'
        }`}
        onClick={handleClick}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <UnMuteIcon className="w-5 h-5" />
        ) : (
          <MuteIcon className="w-5 h-5" />
        )}
      </button>

      <ConfirmModal
        isOpen={showMuteModal}
        onClose={() => setShowMuteModal(false)}
        onConfirm={handleMute}
        title="Mute user?"
        message="You won't see their posts in your timeline. They will still be able to follow you and view your posts."
        confirmText="Mute"
        cancelText="Cancel"
        confirmButtonClass="bg-block hover:bg-block/90 text-white"
        isLoading={isMuteLoading}
      />
    </>
  );
}

export default MuteBtn;
