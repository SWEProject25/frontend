'use client';
import React from 'react';
import Link from 'next/link';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import { FaEllipsisH } from 'react-icons/fa';
import Action from './Action';
import DropDown from './DropDown';
import {
  FaUserPlus,
  FaListUl,
  FaVolumeMute,
  FaBan,
  FaChartBar,
  FaCode,
  FaFlag,
  FaFrown,
} from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';

const dropItems = [
  {
    key: 'not_interested',
    label: 'Not interested in this post',
    icon: <HiOutlineEmojiSad />,
  },
  {
    key: 'follow',
    label: 'Follow @max_misk',
    icon: <FaUserPlus />,
  },
  {
    key: 'lists',
    label: 'Add/remove from Lists',
    icon: <FaListUl />,
  },
  {
    key: 'mute',
    label: 'Mute',
    icon: <FaVolumeMute />,
  },
  {
    key: 'block',
    label: 'Block @max_misk',
    icon: <FaBan />,
  },
  {
    key: 'engagement',
    label: 'View post engagements',
    icon: <FaChartBar />,
  },
  {
    key: 'embed',
    label: 'Embed post',
    icon: <FaCode />,
  },
  {
    key: 'report',
    label: 'Report post',
    icon: <FaFlag />,
  },
  {
    key: 'community_note',
    label: 'Request Community Note',
    icon: <FaFlag />,
  },
];

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
      className="block mx-auto sm:max-w-[600px] border-b border-gray-700 p-4 text-white relative hover:bg-[#0a0a0a] transition-colors"
      style={{ textDecoration: 'none' }}
    >
      <div className="absolute top-2 right-4">
        <DropDown items={dropItems}>
          <Action icon={<FaEllipsisH size={16} />} label="more" color="blue" />
          {/* <FaEllipsisH size={16} /> */}
        </DropDown>
      </div>
      <div className="flex w-full gap-2">
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
