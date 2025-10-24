import React from 'react';
import {
  FaRegComment,
  FaRetweet,
  FaRegHeart,
  FaChartBar,
  FaRegBookmark,
} from 'react-icons/fa';
import { IoStatsChart } from 'react-icons/io5';

import { LuShare } from 'react-icons/lu';
import Action from './Action';

const ACTIONS_META = [
  {
    key: 'reply',
    icon: <FaRegComment size={16} />,
    label: 'Reply',
    color: 'blue',
  },
  {
    key: 'retweet',
    icon: <FaRetweet size={16} />,
    label: 'Repost',
    color: 'green',
  },
  {
    key: 'like',
    icon: <FaRegHeart size={16} />,
    label: 'Like',
    color: 'rose', // use rose for pinkish-red
  },
  {
    key: 'views',
    icon: <IoStatsChart size={16} />,
    label: 'View',
    color: 'blue',
  },
];

const SECONDARY_ACTIONS_META = [
  {
    key: 'bookmark',
    icon: <FaRegBookmark size={16} />,
    label: 'bookmark',
    color: 'blue',
  },
  {
    key: 'share',
    icon: <LuShare size={16} />,
    label: 'Share',
    color: 'blue',
  },
];

type stats = {
  replies: number;
  retweets: number;
  likes: number;
  bookmarks: number;
  views: string;
  booked: boolean;
  liked: boolean;
  reposted: boolean;
};

export default function Actions({
  stats,
  full = false,
}: {
  stats: stats;
  full?: boolean;
}) {
  return (
    <div className="w-full my-.5">
      <div className="flex justify-between items-center w-full mt-3 text-gray-500 text-sm">
        <Action
          icon={ACTIONS_META[0].icon}
          count={stats.replies.toString()}
          label={ACTIONS_META[0].label}
          color={ACTIONS_META[0].color}
        />
        <Action
          icon={ACTIONS_META[1].icon}
          count={stats.retweets.toString()}
          label={ACTIONS_META[1].label}
          color={ACTIONS_META[1].color}
        />
        <Action
          icon={ACTIONS_META[2].icon}
          count={stats.likes.toString()}
          label={ACTIONS_META[2].label}
          color={ACTIONS_META[2].color}
        />
        {!full ? (
          <Action
            icon={ACTIONS_META[3].icon}
            count={stats.views}
            label={ACTIONS_META[3].label}
            color={ACTIONS_META[3].color}
          />
        ) : (
          <Action
            icon={SECONDARY_ACTIONS_META[0].icon}
            label={SECONDARY_ACTIONS_META[0].label}
            color={SECONDARY_ACTIONS_META[0].color}
          />
        )}
        <div className="flex items-center gap-3">
          {!full && (
            <Action
              icon={SECONDARY_ACTIONS_META[0].icon}
              label={SECONDARY_ACTIONS_META[0].label}
              color={SECONDARY_ACTIONS_META[0].color}
            />
          )}
          <Action
            icon={SECONDARY_ACTIONS_META[1].icon}
            label={SECONDARY_ACTIONS_META[1].label}
            color={SECONDARY_ACTIONS_META[1].color}
          />
        </div>
      </div>
    </div>
  );
}
