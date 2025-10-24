'use client';
import React, { useState } from 'react';
import Avatar from './Avatar';
import UserInfo from './UserInfo';

type User = {
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  following?: number;
  followers?: string;
  isVerified: boolean;
  isFollowed?: boolean;
};

export default function ProfileCard({ data }: { data: User }) {
  const [followed, setFollowed] = useState(data.isFollowed || false);
  const [isHovered, setIsHovered] = useState(false);
  const [followClicked, setFollowClicked] = useState(false);

  return (
    <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 hover:border-gray-700 transition-all duration-200 mt-2">
      <div className="flex justify-between items-start">
        <Avatar data={data} size={80} cardShow={false} />
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
            e.preventDefault();
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
      <div className="mt-3">
        <div className="flex items-center space-x-1">
          <UserInfo data={data} direction="vertical" cardShow={false} />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-300">{data.bio}</p>
      <div className="mt-3 flex space-x-3 text-sm">
        <span className="text-gray-400">
          <span className="font-semibold text-white">{data.following}</span>{' '}
          Following
        </span>
        <span className="text-gray-400">
          <span className="font-semibold text-white">{data.followers}</span>{' '}
          Followers
        </span>
      </div>

      <div className="mt-3 border border-gray-700 rounded-full py-2 text-center text-sm text-gray-400 hover:bg-gray-900 cursor-pointer transition">
        Profile Summary
      </div>
    </div>
  );
}
