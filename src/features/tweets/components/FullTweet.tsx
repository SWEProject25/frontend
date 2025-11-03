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
import Loader from '@/components/generic/Loader';

function FullTweet({
  data,
  replies,
}: {
  data: TimelineFeed | null;
  replies: TimelineFeed[] | null;
}) {
  if (!data || !replies) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader />
      </div>
    );
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
    postId: data.postId,
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
          </div>
          <div className="border-b border-gray-700 my-2" />
          <Actions stats={actionsStats} full={true} />
          <div className="border-b border-gray-700 mt-3" />
        </div>
      </div>
      <div>
        {replies.map((reply, index) => (
          <Tweet key={index} data={reply} />
        ))}
      </div>
    </div>
  );
}

export default FullTweet;
