'use client';
import React, { useState } from 'react';

interface FollowBtnProps {
  isFollowed?: boolean;
}

function FollowBtn({ isFollowed }: FollowBtnProps) {
  const [followed, setFollowed] = useState<boolean>(isFollowed || false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [followClicked, setFollowClicked] = useState<boolean>(false);

  const handleFollow = () => {
    // TODO: Implement follow functionality
    console.log('Follow clicked');
  };

  const handleUnfollow = () => {
    // TODO: Implement unfollow functionality
    console.log('Unfollow clicked');
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!followed) {
      setFollowClicked(true);
      setFollowed(true);
      handleFollow();
    } else {
      setFollowed(false);
      setFollowClicked(false);
      handleUnfollow();
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
