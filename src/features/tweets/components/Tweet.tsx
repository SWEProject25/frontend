'use client';
import React from 'react';
import Link from 'next/link';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import { FaEllipsisH } from 'react-icons/fa';

const data = {
  user: {
    name: 'Omda Hancker',
    username: '@mohamedemad',
    avatar: '/apple.png',
    isVerified: true,
  },
  tweet: {
    id: '1', // Add an id for routing
    text: 'Tweet content goes here. This is a sample tweet to demonstrate the layout.',
    image: '/Personal photo.jpeg',
    stats: {
      replies: 2,
      retweets: 4,
      likes: 24,
      views: '1.5K',
      saved: true,
      shared: false,
    },
  },
};

export default function Tweet() {
  return (
    <Link
      href={'/fullTweet'}
      className="block max-w-xl mx-auto border-b border-gray-700 p-4 text-white relative hover:bg-[#0a0a0a] transition-colors"
      style={{ textDecoration: 'none' }}
    >
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 transition-colors"
        aria-label="Tweet details"
        onClick={(e) => {
          e.preventDefault();
          // Optionally: open a menu or stop propagation
        }}
      >
        <FaEllipsisH size={16} />
      </button>
      <div className="flex gap-2">
        <Avatar image={data.user.avatar} />
        <div className="flex flex-col flex-1">
          <UserInfo
            name={data.user.name}
            username={data.user.username}
            isVerified={data.user.isVerified}
          />
          <Content text={data.tweet.text} image={data.tweet.image} />
          <Actions stats={data.tweet.stats} />
        </div>
      </div>
    </Link>
  );
}
