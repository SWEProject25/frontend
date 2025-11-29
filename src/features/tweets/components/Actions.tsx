'use client';
import React, { useState } from 'react';
import Action from './Action';
import { LikeIconFilled } from '@/components/ui/icons/UIIcons';
import { ACTIONS_META } from '../constants';
import {
  useToggleLikeTweet,
  useToggleRepostTweet,
} from '@/features/tweets/hooks/tweetQueries';
import DropDown from './DropDown';
import { getShareDropdownItems } from '../constants/dropdown';
type stats = {
  postId: number;
  isRepost: boolean;
  isQuote: boolean;
  userId: number;
  type?: string;
  parentId?: number | null;
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isFollowedByMe: boolean;
  isRepostedByMe: boolean;
};

export default function Actions({
  stats,
  full = false,
  onOpened,
}: {
  stats: stats;
  full?: boolean;
  onOpened?: (opened: boolean) => void;
}) {
  const shareDropdownItems = getShareDropdownItems();
  const [liked, setLiked] = useState(stats.isLikedByMe);
  const [retweeted, setRetweeted] = useState(stats.isRepostedByMe);
  const [likeAddr, setLikeAddr] = useState(0);
  const [retweetAddr, setRetweetAddr] = useState(0);
  const toggleLikeTweet = useToggleLikeTweet(
    stats.postId,
    stats.isRepost,
    stats.isQuote,
    stats.userId,
    stats.parentId,
    stats.type
  );
  const toggleRepostTweet = useToggleRepostTweet(
    stats.postId,
    stats.isRepost,
    stats.isQuote,
    stats.userId,
    stats.parentId,
    stats.type
  );
  function handleLike() {
    // if (stats.isLikedByMe) {
    //   if (liked) {
    //     setLikeAddr(-1);
    //   } else {
    //     setLikeAddr(0);
    //   }
    // } else {
    //   if (liked) {
    //     setLikeAddr(0);
    //   } else {
    //     setLikeAddr(1);
    //   }
    // }
    // setLiked(!liked);
    toggleLikeTweet.mutate();
  }
  function handleRetweet() {
    // if (stats.isRepostedByMe) {
    //   if (retweeted) {
    //     setRetweetAddr(-1);
    //   } else {
    //     setRetweetAddr(0);
    //   }
    // } else {
    //   if (retweeted) {
    //     setRetweetAddr(0);
    //   } else {
    //     setRetweetAddr(1);
    //   }
    // }
    // setRetweeted(!stats.is);
    toggleRepostTweet.mutate();
  }
  function onSelect(key: string) {
    console.log('Selected item key:', key);
    switch (key) {
      case 'copy_link':
        const link = `${window.location.origin}/home/${stats.postId}`;
        navigator.clipboard.writeText(link);
        break;
      case 'send_via_message':
        // Implement send via message functionality here
        break;
      default:
        break;
    }
  }
  return (
    <div className="w-full my-.5" data-testid="tweet-actions">
      <div className="flex justify-between items-center w-full mt-3 text-gray-500 text-sm">
        <Action
          icon={ACTIONS_META[0].icon}
          count={stats.commentsCount !== undefined ? stats.commentsCount : 0}
          label={ACTIONS_META[0].label}
          color={ACTIONS_META[0].color}
        />
        <Action
          icon={ACTIONS_META[1].icon}
          count={
            stats.retweetsCount
            // stats.retweetsCount !== undefined
            //   ? stats.retweetsCount + retweetAddr
            //   : 0
          }
          label={ACTIONS_META[1].label}
          color={ACTIONS_META[1].color}
          onClick={handleRetweet}
          isColored={stats.isRepostedByMe}
        />
        <Action
          icon={
            stats.isLikedByMe ? (
              <LikeIconFilled className="w-5 h-5 text-rose-400" />
            ) : (
              ACTIONS_META[2].icon
            )
          }
          count={
            stats.likesCount !== undefined ? stats.likesCount + likeAddr : 0
          }
          label={ACTIONS_META[2].label}
          color={ACTIONS_META[2].color}
          onClick={handleLike}
          isColored={stats.isLikedByMe}
        />
        <DropDown
          items={shareDropdownItems}
          onOpened={onOpened}
          onSelect={onSelect}
        >
          <Action
            icon={ACTIONS_META[3].icon}
            label={ACTIONS_META[3].label}
            color={ACTIONS_META[3].color}
            stopPropagation={false}
          />
        </DropDown>
      </div>
    </div>
  );
}
