import { TbSpeakerphone } from 'react-icons/tb';
import { IoStatsChart } from 'react-icons/io5';
import { TiVolumeMute } from 'react-icons/ti';
import { FaUserPlus, FaListUl, FaBan, FaCode, FaFlag } from 'react-icons/fa';
import { HiOutlineEmojiSad } from 'react-icons/hi';

/**
 * Tweet dropdown menu items
 */
export const TWEET_DROPDOWN_ITEMS = [
  {
    key: 'not_interested',
    label: 'Not interested in this post',
    icon: <HiOutlineEmojiSad />,
  },
  {
    key: 'follow',
    label: 'Follow @max_misk',
    icon: <FaUserPlus />,
  },
  {
    key: 'lists',
    label: 'Add/remove from Lists',
    icon: <FaListUl />,
  },
  {
    key: 'mute',
    label: 'Mute',
    icon: <TiVolumeMute />,
  },
  {
    key: 'block',
    label: 'Block @max_misk',
    icon: <FaBan />,
  },
  {
    key: 'engagement',
    label: 'View post engagements',
    icon: <IoStatsChart />,
  },
  {
    key: 'embed',
    label: 'Embed post',
    icon: <FaCode />,
  },
  {
    key: 'report',
    label: 'Report post',
    icon: <FaFlag />,
  },
  {
    key: 'community_note',
    label: 'Request Community Note',
    icon: <TbSpeakerphone />,
  },
];
