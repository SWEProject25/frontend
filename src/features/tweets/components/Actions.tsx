'use client';
import React, { useState } from 'react';
import Action from './Action';
import { LikeIconFilled } from '@/components/ui/icons/UIIcons';
import { ACTIONS_META } from '../constants';

type stats = {
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
}: {
  stats: stats;
  full?: boolean;
}) {
  const [liked, setLiked] = useState(stats.isLikedByMe);
  const [retweeted, setRetweeted] = useState(stats.isRepostedByMe);
  function handleLike() {
    setLiked(!liked);
  }
  function handleRetweet() {
    setRetweeted(!retweeted);
  }
  return (
    <div className="w-full my-.5">
      <div className="flex justify-between items-center w-full mt-3 text-gray-500 text-sm">
        <Action
          icon={ACTIONS_META[0].icon}
          count={stats.commentsCount.toString()}
          label={ACTIONS_META[0].label}
          color={ACTIONS_META[0].color}
        />
        <Action
          icon={ACTIONS_META[1].icon}
          count={stats.retweetsCount.toString()}
          label={ACTIONS_META[1].label}
          color={ACTIONS_META[1].color}
          onClick={handleRetweet}
          isColored={retweeted}
        />
        <Action
          icon={
            liked ? (
              <LikeIconFilled className="w-5 h-5 text-rose-400" />
            ) : (
              ACTIONS_META[2].icon
            )
          }
          count={stats.likesCount.toString()}
          label={ACTIONS_META[2].label}
          color={ACTIONS_META[2].color}
          onClick={handleLike}
          isColored={liked}
        />
        <Action
          icon={ACTIONS_META[3].icon}
          label={ACTIONS_META[3].label}
          color={ACTIONS_META[3].color}
        />
      </div>
    </div>
  );
}
