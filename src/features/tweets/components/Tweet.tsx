'use client';
import React, { useState } from 'react';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import Avatar from './Avatar';
import { TbSpeakerphone } from 'react-icons/tb';
import { IoStatsChart } from 'react-icons/io5';
import { TiVolumeMute } from 'react-icons/ti';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';
import { FaUserPlus, FaListUl, FaBan, FaCode, FaFlag } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { TimelineFeed } from '@/features/timeline/types/api';
import { useTweetStore } from '../store/tweetStore';
import { DropIcon } from '@/components/ui/icons/UIIcons';
import { GrokIcon } from '@/components/ui/icons/BrandIcons';
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

type MediaItem = {
  url: string;
  type: string | 'image' | 'video';
};

type TweetContent = {
  text?: string;
  media?: MediaItem[];
};

type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
};

type TweetData = {
  id: string;
  content: TweetContent;
  user: User;
  time: Date;
  Actions: TweetActions;
};

export default function Tweet({ data }: { data: TimelineFeed }) {
  const [Hovered, setHovered] = useState(false);
  const router = useRouter();
  const user = {
    id: data.userId,
    name: data.name,
    username: data.username,
    verified: data.verified,
    avatar: data.avatar,
  };
  const content = {
    text: data.text,
    media: data.media,
  };

  const actionsStats = {
    postId: data.postId,
    likesCount: data.likesCount,
    retweetsCount: data.retweetsCount,
    commentsCount: data.commentsCount,
    isLikedByMe: data.isLikedByMe,
    isFollowedByMe: data.isFollowedByMe,
    isRepostedByMe: data.isRepostedByMe,
  };

  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  return (
    <div
      onClick={() => {
        setCurrentTweet(data);
        router.push(`/home/${data.userId}`);
      }}
      className={`block mx-auto w-full border-b border-gray-700 text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0a0a0a]' : ''} hover:cursor-pointer p-4`}
    >
      <div className="flex w-full gap-2">
        <Avatar size={30} data={user} onHoverCard={setHovered} />
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              <UserInfo data={user} onHoverCard={setHovered} />
              <span className="text-gray-500">.</span>
              <Timing time={data.date} />
            </div>
            <div className="ml-2 flex items-center space-x-2 text-gray-500">
              <Action
                icon={<GrokIcon />} // smaller icon
                label="Explain this post"
                color="blue"
              />
              <DropDown items={dropItems} onOpened={setHovered}>
                <Action
                  icon={<DropIcon />} // smaller icon
                  label="more"
                  color="blue"
                  stopPropagation={false}
                />
              </DropDown>
            </div>
          </div>
          <Content content={content} />
          <Actions stats={actionsStats} />
        </div>
      </div>
    </div>
  );
}
