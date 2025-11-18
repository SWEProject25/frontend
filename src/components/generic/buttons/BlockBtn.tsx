'use client';
import React, { useState } from 'react';

interface BlockBtnProps {
  isBlocked?: boolean;
}

function BlockBtn({ isBlocked }: BlockBtnProps) {
  const [blocked, setBlocked] = useState<boolean>(isBlocked || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleBlock = () => {
    // TODO: Implement block functionality
    console.log('Block clicked');
  };

  const handleUnblock = () => {
    // TODO: Implement unblock functionality
    console.log('Unblock clicked');
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!blocked) {
      setBlocked(true);
      handleBlock();
    } else {
      setBlocked(false);
      handleUnblock();
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
