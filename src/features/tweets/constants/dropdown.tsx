import {
  NotInterstedIcon,
  FollowIcon,
  UnfollowIcon,
  AddtoList,
  MuteIcon,
  BlockIcon,
  EngagementsIcon,
  EmbedIcon,
  ReportIcon,
  RequestCommunityIcon,
  CopyLinkIcon,
  SendViaMsgICon,
  QuoteIcon,
} from '@/components/ui/icons/DropDownIcons';
import { RetweetIcon } from '@/components/ui/icons/UIIcons';

/**
 * Tweet dropdown menu items generator
 */
export const getTweetDropdownItems = ({
  username = '@user',
  isFollowed = false,
  isMuted = false,
  isBlocked = false,
}: {
  username?: string;
  isFollowed?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
} = {}) => {
  const items = [
    {
      key: 'not_interested',
      label: 'Not interested in this post',
      icon: <NotInterstedIcon />,
    },
    ...(!isBlocked
      ? [
          {
            key: 'follow',
            label: isFollowed ? `Unfollow ${username}` : `Follow ${username}`,
            icon: isFollowed ? <UnfollowIcon /> : <FollowIcon />,
          },
        ]
      : []),
    {
      key: 'lists',
      label: 'Add/remove from Lists',
      icon: <AddtoList />,
    },
    {
      key: 'mute',
      label: isMuted ? `Unmute ${username}` : `Mute ${username}`,
      icon: <MuteIcon />,
    },
    {
      key: 'block',
      label: isBlocked ? `Unblock ${username}` : `Block ${username}`,
      icon: <BlockIcon />,
    },
    {
      key: 'engagement',
      label: 'View post engagements',
      icon: <EngagementsIcon />,
    },
    {
      key: 'embed',
      label: 'Embed post',
      icon: <EmbedIcon />,
    },
    {
      key: 'report',
      label: 'Report post',
      icon: <ReportIcon />,
    },
    {
      key: 'community_note',
      label: 'Request Community Note',
      icon: <RequestCommunityIcon />,
    },
  ];

  return items;
};

export const getShareDropdownItems = () => [
  {
    key: 'copy_link',
    label: 'copy link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'send_via_message',
    label: 'Send via Direct Message',
    icon: <SendViaMsgICon />,
  },
];

export const getRepostDropdownItems = ({
  isRepostedByMe = false,
}: {
  isRepostedByMe?: boolean;
}) => [
  {
    key: 'repost',
    label: isRepostedByMe ? 'Undo Repost' : 'Repost',
    icon: <RetweetIcon />,
  },
  {
    key: 'quote_post',
    label: 'Quote',
    icon: <QuoteIcon />,
  },
];
