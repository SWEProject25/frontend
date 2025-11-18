'use client';
import React, { useState, useEffect } from 'react';
import { MuteIcon, UnMuteIcon } from '@/components/ui/icons';
import { useInteractions } from '@/hooks/useInteractions';

interface MuteBtnProps {
  userId: number;
  isMuted?: boolean;
}

function MuteBtn({ userId, isMuted }: MuteBtnProps) {
  const [muted, setMuted] = useState<boolean>(isMuted || false);

  const { muteUser, unmuteUser, isMuteLoading } = useInteractions();

  // Update local state when prop changes
  useEffect(() => {
    setMuted(isMuted || false);
  }, [isMuted]);

  const handleMute = async () => {
    try {
      await muteUser(userId);
    } catch {
      // Revert state on error
      setMuted(false);
    }
  };

  const handleUnmute = async () => {
    try {
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
      setMuted(true);
      await handleMute();
    } else {
      setMuted(false);
      await handleUnmute();
    }
  };

  return (
    <button
      type="button"
      className={`p-2 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
        muted
          ? 'bg-background text-block border-block border-1 hover:bg-block/10'
          : 'bg-background text-primary hover:bg-primary/10 border-primary/40 border-1'
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
  );
}

export default MuteBtn;
