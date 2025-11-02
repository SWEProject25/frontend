'use client';
import React from 'react';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import TweetAvatar from './TweetAvatar';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';
import Tweet from './Tweet';
import Header from './Header';
import { TimelineFeed } from '@/features/timeline/types/api';
import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import { DropIcon } from '@/components/ui/icons/UIIcons';
import { TWEET_DROPDOWN_ITEMS } from '../constants';

function FullTweet({
  data,
  reply,
}: {
  data: TimelineFeed | null;
  reply: TimelineFeed | null;
}) {
  if (!data || !reply) {
    return <div>Loading...</div>;
  }
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
    likesCount: data.likesCount,
    retweetsCount: data.retweetsCount,
    commentsCount: data.commentsCount,
    isLikedByMe: data.isLikedByMe,
    isFollowedByMe: data.isFollowedByMe,
    isRepostedByMe: data.isRepostedByMe,
  };

  return (
    <div>
      <Header />
      <div className="mx-auto sm:max-w-[600px] p-4 text-white relative ">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <TweetAvatar data={user} />
            <UserInfo data={user} direction="vertical" />
          </div>
          <div className="ml-2 flex items-center space-x-2 text-gray-500">
            <Action
              icon={<GrokIcon />} // smaller icon
              label="Explain this post"
              color="blue"
            />
            <DropDown items={TWEET_DROPDOWN_ITEMS}>
              <Action
                icon={<DropIcon />}
                label="more"
                color="blue"
                stopPropagation={false}
              />
            </DropDown>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <Content content={content} />
          <div className="flex items-center space-x-1">
            <Timing time={data.date} full={true} />
            {/* <span className="text-gray-400 text-sm"> · </span>
            <span className="text-gray-200 bold text-sm">
              {data.Actions.views}{' '}
              <span className="text-gray-400 text-sm">Views</span>
            </span> */}
          </div>
          <div className="border-b border-gray-700 my-2" />
          <Actions stats={actionsStats} full={true} />
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
