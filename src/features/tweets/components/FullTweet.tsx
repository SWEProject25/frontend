'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import { FaEllipsisH } from 'react-icons/fa';
import { TbSpeakerphone } from 'react-icons/tb';
import { IoStatsChart } from 'react-icons/io5';
import { TiVolumeMute } from 'react-icons/ti';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// <FontAwesomeIcon icon={byPrefixAndName.far['user-plus']} />;
import {
  FaUserPlus,
  FaListUl,
  FaVolumeMute,
  FaBan,
  FaChartBar,
  FaCode,
  FaFlag,
} from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import Tweet from './Tweet';

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
    icon: <TiVolumeMute />,
  },
  {
    key: 'block',
    label: 'Block @max_misk',
    icon: <FaBan />,
  },
  {
    key: 'engagement',
    label: 'View post engagements',
    icon: <IoStatsChart />,
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
    icon: <TbSpeakerphone />,
  },
];

type TweetActions = {
  replies: number;
  retweets: number;
  likes: number;
  bookmarks: number;
  views: string;
  booked: boolean;
  liked: boolean;
  reposted: boolean;
};

type TweetContent = {
  text?: string;
  image?: string;
};

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

type TweetData = {
  id: string;
  content: TweetContent;
  user: User;
  time: Date;
  Actions: TweetActions;
};

function FullTweet({ data, reply }: { data: TweetData; reply: TweetData }) {
  return (
    <div>
      <div className="mx-auto sm:max-w-[600px] p-4 text-white relative">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <Avatar data={data.user} />
            <UserInfo data={data.user} direction="vertical" />
          </div>
          <DropDown items={dropItems}>
            <Action
              icon={<FaEllipsisH size={12} />}
              label="more"
              color="blue"
            />
          </DropDown>
        </div>
        <div className="mt-4 space-y-4">
          <Content content={data.content} />
          <div className="flex items-center space-x-1">
            <Timing time={data.time} full={true} />
            <span className="text-gray-400 text-sm"> · </span>
            <span className="text-gray-200 bold text-sm">
              {data.Actions.views}{' '}
              <span className="text-gray-400 text-sm">Views</span>
            </span>
          </div>
          <div className="border-b border-gray-700 my-2" />
          <Actions stats={data.Actions} full={true} />
          <div className="border-b border-gray-700 mt-3" />
        </div>
      </div>
      <div>
        <Tweet data={reply} />
        <Tweet data={reply} />
        <Tweet data={reply} />
      </div>
    </div>
  );
}

export default FullTweet;
