'use client';
import React, { useState } from 'react';
import { MuteIcon, UnMuteIcon } from '@/components/ui/icons';

interface MuteBtnProps {
  isMuted?: boolean;
}

function MuteBtn({ isMuted }: MuteBtnProps) {
  const [muted, setMuted] = useState<boolean>(isMuted || false);

  const handleMute = () => {
    // TODO: Implement mute functionality
    console.log('Mute clicked');
  };

  const handleUnmute = () => {
    // TODO: Implement unmute functionality
    console.log('Unmute clicked');
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!muted) {
      setMuted(true);
      handleMute();
    } else {
      setMuted(false);
      handleUnmute();
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
