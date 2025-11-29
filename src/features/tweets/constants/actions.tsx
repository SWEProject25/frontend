import {
  LikeIcon,
  ReplyIcon,
  RetweetIcon,
  ShareIcon,
} from '@/components/ui/icons/UIIcons';

/**
 * Tweet action buttons metadata
 */
export const ACTIONS_META = ({
  isRepostedByMe,
  isLikedByMe,
}: {
  isRepostedByMe?: boolean;
  isLikedByMe?: boolean;
}) => [
  {
    key: 'reply',
    icon: <ReplyIcon />,
    label: 'Reply',
    color: 'blue',
  },
  {
    key: 'retweet',
    icon: <RetweetIcon />,
    label: isRepostedByMe ? 'Undo Repost' : 'Repost',
    color: 'green',
  },
  {
    key: 'like',
    icon: <LikeIcon />,
    label: isLikedByMe ? 'Unlike' : 'Like',
    color: 'rose', // use rose for pinkish-red
  },
  {
    key: 'share',
    icon: <ShareIcon />,
    label: 'Share',
    color: 'blue',
  },
];

/**
 * Color mapping for tweet actions (hover state)
 */
export const ACTION_COLOR_MAP: Record<string, string> = {
  blue: 'group-hover:text-blue-400',
  green: 'group-hover:text-green-500',
  rose: 'group-hover:text-rose-400',
  gray: 'group-hover:text-gray-400',
};

/**
 * Glow effect mapping for tweet actions (background glow on hover)
 */
export const ACTION_GLOW_MAP: Record<string, string> = {
  blue: 'group-hover:before:bg-blue-400/20',
  green: 'group-hover:before:bg-green-500/20',
  rose: 'group-hover:before:bg-rose-400/20',
  gray: 'group-hover:before:bg-gray-400/20',
};

/**
 * Active state color mapping for tweet actions
 */
export const ACTION_ACTIVE_MAP: Record<string, string> = {
  blue: 'text-blue-400',
  green: 'text-green-500',
  rose: 'text-rose-400',
  gray: 'text-gray-500',
};
