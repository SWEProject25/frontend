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

const time = new Date(Date.now() - 250 * 1000 * 60);
const data = {
  user: {
    name: 'Omda Hancker',
    username: '@mohamedemad',
    avatar: '/apple.png',
    isVerified: true,
  },
  tweet: {
    id: '1',
    text: 'Tweet content goes here. This is a sample tweet to demonstrate the layout.',
    image: '/Personal photo.jpeg',
    time: time,
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
  const [profileCardHovered, setProfileCardHovered] = useState(false);
  return (
    <Link
      href={'/fullTweet'}
      className={`block mx-auto sm:max-w-[600px] border-b border-gray-700 p-4 text-white relative transition-colors ${!profileCardHovered ? 'hover:bg-[#0a0a0a]' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      <div className="flex w-full gap-2">
        <Avatar
          image={data.user.avatar}
          size={48}
          name={data.user.name}
          username={data.user.username}
          isVerified={data.user.isVerified}
          bio="Sample bio for the user."
          following={100}
          followers="1K"
          isFollowed={false}
          onHoverCard={setProfileCardHovered}
        />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <UserInfo
                name={data.user.name}
                username={data.user.username}
                isVerified={data.user.isVerified}
                bio="Sample bio for the user."
                following={100}
                followers="1K"
                isFollowed={false}
                avatar={data.user.avatar}
                onHoverCard={setProfileCardHovered}
              />
              <Timing time={data.tweet.time} />
            </div>
            <div className="ml-2 flex items-center">
              <DropDown items={dropItems}>
                <Action
                  icon={<FaEllipsisH size={12} />} // smaller icon
                  label="more"
                  color="blue"
                />
              </DropDown>
            </div>
          </div>
          <Content text={data.tweet.text} image={data.tweet.image} />
          <Actions stats={data.tweet.stats} />
        </div>
      </div>
    </Link>
  );
}
