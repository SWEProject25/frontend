'use client';
import React, { useState } from 'react';
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
import { Grok } from '@lobehub/icons';
import { FaUserPlus, FaListUl, FaBan, FaCode, FaFlag } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
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

export default function Tweet({ data }: { data: TweetData }) {
  const [Hovered, setHovered] = useState(false);
  const router = useRouter();
  return (
    <div
      onClick={() => router.push('/fullTweet')}
      //href={`/tweet/${data.id}`}
      className={`block mx-auto w-full border-b border-gray-700 p-4 text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0a0a0a]' : ''} hover:cursor-pointer`}
      // style={{ textDecoration: 'none' }}
    >
      <div className="flex w-full gap-2">
        <Avatar size={48} data={data.user} onHoverCard={setHovered} />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <UserInfo data={data.user} onHoverCard={setHovered} />
              <span className="text-gray-500">.</span>
              <Timing time={data.time} />
            </div>
            <div className="ml-2 flex items-center space-x-2 text-gray-500">
              <Action
                icon={<Grok size={18} />} // smaller icon
                label="Explain this post"
                color="blue"
              />
              <DropDown items={dropItems} onOpened={setHovered}>
                <Action
                  icon={<FaEllipsisH size={12} />} // smaller icon
                  label="more"
                  color="blue"
                  stopPropagation={false}
                />
              </DropDown>
            </div>
          </div>
          <Content content={data.content} />
          <Actions stats={data.Actions} />
        </div>
      </div>
    </div>
  );
}
