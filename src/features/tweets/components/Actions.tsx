import React from 'react';
import {
  FaRegComment,
  FaRetweet,
  FaRegHeart,
  FaChartBar,
  FaRegBookmark,
} from 'react-icons/fa';
import { LuShare } from 'react-icons/lu';

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
        <div className="flex gap-7">
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
        </div>
        <div className="flex min-w-[120px] justify-end ">
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
  );
}

function Action({
  icon,
  count,
  label,
  color,
}: {
  icon: React.ReactNode;
  count?: string;
  label: string;
  color: string;
}) {
  // Icon and glow color classes
  const colorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-500',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400', // Tailwind rose-400 is a pinkish-red
  };
  const countColorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-500',
    green: 'group-hover:text-green-500',
    rose: 'group-hover:text-rose-400',
  };
  // Lower brightness for glow
  const glowMap: Record<string, string> = {
    blue: 'group-hover:before:bg-blue-500/20',
    green: 'group-hover:before:bg-green-500/20',
    rose: 'group-hover:before:bg-rose-400/20',
  };
  const labelBgMap: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    rose: 'bg-rose-400',
  };

  return (
    <div className="flex flex-col items-center min-w-[48px] group relative">
      <div className="relative flex items-center gap-1 cursor-pointer transition-colors p-2">
        {/* Glow circle only around icon, sharp edge, only on hover */}
        <span
          className={`
            relative flex items-center justify-center
            w-8 h-8
            rounded-full
            before:content-['']
            before:absolute
            before:inset-0
            before:rounded-full
            before:opacity-0
            group-hover:before:opacity-100
            before:z-[-1]
            ${glowMap[color]}
            transition-all
          `}
        >
          <span className={`transition-colors ${colorMap[color]}`}>{icon}</span>
        </span>
        {count !== undefined && (
          <span className={`text-xs transition-colors ${countColorMap[color]}`}>
            {count}
          </span>
        )}
      </div>
      {/* Label on hover */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-10
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-opacity
          text-white text-xs px-2 py-1 rounded
          ${labelBgMap[color]}
          shadow
          z-10
          whitespace-nowrap
        `}
      >
        {label}
      </div>
    </div>
  );
}
