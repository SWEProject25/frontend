'use client';
import React, { useState } from 'react';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import TweetAvatar from './TweetAvatar';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';
import { useRouter } from 'next/navigation';
import { TimelineFeed } from '@/features/timeline/types/api';
import { useTweetStore } from '../store/tweetStore';
import { DropIcon } from '@/components/ui/icons/UIIcons';
import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import { TWEET_DROPDOWN_ITEMS } from '../constants';

export default function Tweet({ data }: { data: TimelineFeed }) {
  const [Hovered, setHovered] = useState(false);
  const router = useRouter();
  const user = {
    id: data.userId,
    name: data.name,
    username: data.username,
    verified: data.verified,
    avatar: data.avatar,
    isFollowedByMe: data.isFollowedByMe,
  };
  const content = {
    text: data.text,
    media: data.media,
  };

  const actionsStats = {
    postId: data.postId,
    isRepost: data.isRepost,
    isQuote: data.isQuote,
    userId: data.userId,
    likesCount: data.likesCount,
    type: data?.type ?? 'POST',
    parentId: data?.parentId,
    retweetsCount: data.retweetsCount,
    commentsCount: data.commentsCount,
    isLikedByMe: data.isLikedByMe,
    isFollowedByMe: data.isFollowedByMe,
    isRepostedByMe: data.isRepostedByMe,
  };

  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  return (
    <div
      data-testid={`tweet-${data.postId}`}
      onClick={() => {
        setCurrentTweet(data);
        router.push(`/home/${data.postId}`);
      }}
      className={`block mx-auto w-full border-b border-gray-700 text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0a0a0a]' : ''} hover:cursor-pointer p-4`}
    >
      <div className="flex w-full gap-2">
        <TweetAvatar data={user} onHoverCard={setHovered} />
        <div className="flex flex-col items-center flex-1">
          <div
            className="flex items-center justify-between w-full"
            data-testid="tweet-header"
          >
            <div className="flex items-center gap-1">
              <UserInfo data={user} onHoverCard={setHovered} />
              <span className="text-gray-500">.</span>
              <Timing time={data.date} />
            </div>
            <div
              className="ml-2 flex items-center space-x-2 text-gray-500"
              data-testid="tweet-actions-header"
            >
              <Action
                icon={<GrokIcon />} // smaller icon
                label="Explain this post"
                color="blue"
              />
              <DropDown
                items={TWEET_DROPDOWN_ITEMS}
                onOpened={setHovered}
                temp={data.isFollowedByMe}
                userName={data.username}
              >
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
