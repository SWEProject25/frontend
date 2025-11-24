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
} from '@/components/ui/icons/DropDownIcons';

/**
 * Tweet dropdown menu items generator
 */
export const getTweetDropdownItems = ({
  username = '@user',
  isFollowed = false,
}: {
  username?: string;
  isFollowed?: boolean;
} = {}) => [
  {
    key: 'not_interested',
    label: 'Not interested in this post',
    icon: <NotInterstedIcon />,
  },
  {
    key: 'follow',
    label: isFollowed ? `Unfollow ${username}` : `Follow ${username}`,
    icon: isFollowed ? <UnfollowIcon /> : <FollowIcon />,
  },
  {
    key: 'lists',
    label: 'Add/remove from Lists',
    icon: <AddtoList />,
  },
  {
    key: 'mute',
    label: 'Mute',
    icon: <MuteIcon />,
  },
  {
    key: 'block',
    label: `Block ${username}`,
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
