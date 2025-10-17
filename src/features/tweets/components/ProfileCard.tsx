'use client';
import React, { useState } from 'react';
import Avatar from './Avatar';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

interface ProfileCardProps {
  name: string;
  username: string;
  isVerified?: boolean;
  bio: string;
  following: number;
  followers: string;
  avatar: string;
  isFollowed?: boolean;
}

export default function ProfileCard({
  name,
  username,
  isVerified,
  bio,
  following,
  followers,
  avatar,
  isFollowed,
}: ProfileCardProps) {
  const [followed, setFollowed] = useState(isFollowed || false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-64 h-full bg-black text-white rounded-2xl p-4 shadow-lg shadow-white/20 border border-gray-800 hover:border-gray-700 transition-all duration-200">
      <div className="flex justify-between items-start">
        <Avatar image={avatar} size={80} />
        <button
          className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
            followed
              ? 'bg-black text-white border border-white hover:bg-black transition-colors hover:text-red-600 hover:border-red-600'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
          onClick={() => setFollowed(!followed)}
          onMouseEnter={(e) => {
            e.preventDefault();
            setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {followed ? (isHovered ? 'Unfollow' : 'Following') : 'Follow'}
        </button>
      </div>
      <div className="mt-3">
        <div className="flex items-center space-x-1">
          <Link href="/profile" className="flex flex-col items-start gap-0">
            <div className="flex items-center gap-1">
              <span className="font-bold hover:underline">{name}</span>
              {isVerified && (
                <FaCheckCircle className="inline text-blue-500" size={16} />
              )}
            </div>
            <span className="text-gray-400 text-sm">{username}</span>
          </Link>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-300">{bio}</p>
      <div className="mt-3 flex space-x-3 text-sm">
        <span className="text-gray-400">
          <span className="font-semibold text-white">{following}</span>{' '}
          Following
        </span>
        <span className="text-gray-400">
          <span className="font-semibold text-white">{followers}</span>{' '}
          Followers
        </span>
      </div>

      <div className="mt-3 border border-gray-700 rounded-full py-2 text-center text-sm text-gray-400 hover:bg-gray-900 cursor-pointer transition">
        Profile Summary
      </div>
    </div>
  );
}
