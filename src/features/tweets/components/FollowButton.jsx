'use client';
import React, { useState } from 'react';
function FollowButton({ isFollowed }) {
  const [followed, setFollowed] = useState(isFollowed || false);
  const [isHovered, setIsHovered] = useState(false);
  const [followClicked, setFollowClicked] = useState(false);
  return (
    <div>
      <button
        className={`px-5 py-2 rounded-full font-semibold text-sm transition cursor-pointer ${
          followed
            ? followClicked
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-black text-white border border-gray-700 hover:bg-red-500/20 transition-colors hover:text-red-500 hover:border-red-500'
            : 'bg-white text-black hover:bg-gray-200'
        }`}
        onClick={() => {
          if (!followed) {
            setFollowClicked(true);
            setFollowed(true);
          } else {
            setFollowed(false);
            setFollowClicked(false);
          }
        }}
        onMouseEnter={(e) => {
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
    </div>
  );
}

export default FollowButton;
