import React from 'react';
import {
  FaRegComment,
  FaRetweet,
  FaRegHeart,
  FaChartBar,
  FaRegBookmark,
} from 'react-icons/fa';
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
    icon: <FaChartBar size={16} />,
    label: 'Views',
    color: 'blue',
  },
];

const SECONDARY_ACTIONS_META = [
  {
    key: 'save',
    icon: <FaRegBookmark size={16} />,
    label: 'Save',
    color: 'blue',
  },
  {
    key: 'share',
    icon: <LuShare size={16} />,
    label: 'Share',
    color: 'blue',
  },
];

export default function Actions({
  stats,
}: {
  stats: {
    replies: number;
    retweets: number;
    likes: number;
    views: string;
    saved?: boolean;
    shared?: boolean;
  };
}) {
  return (
    <div>
      <div className="flex justify-between mt-3 text-gray-400 text-sm">
        <div className="flex gap-7 space-x-7">
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
          <Action
            icon={ACTIONS_META[3].icon}
            count={stats.views}
            label={ACTIONS_META[3].label}
            color={ACTIONS_META[3].color}
          />
          <div className="flex min-w-[100px] justify-end ">
            <Action
              icon={SECONDARY_ACTIONS_META[0].icon}
              label={SECONDARY_ACTIONS_META[0].label}
              color={SECONDARY_ACTIONS_META[0].color}
            />
            <Action
              icon={SECONDARY_ACTIONS_META[1].icon}
              label={SECONDARY_ACTIONS_META[1].label}
              color={SECONDARY_ACTIONS_META[1].color}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
