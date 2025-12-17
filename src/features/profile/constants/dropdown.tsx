import React from 'react';
import { MuteIcon, UnMuteIcon } from '@/components/ui/icons/UIIcons';
import { DropdownItemType } from '@/components/generic/Dropdown';

export const getProfileDropdownItems = (
  username: string,
  isMuted: boolean,
  isBlocked: boolean
): DropdownItemType[] => [
  {
    key: 'mute',
    label: isMuted ? `Unmute @${username}` : `Mute @${username}`,
    icon: isMuted ? (
      <UnMuteIcon className="w-5 h-5" />
    ) : (
      <MuteIcon className="w-5 h-5" />
    ),
    color: 'default',
  },
  {
    key: 'block',
    label: isBlocked ? `Unblock @${username}` : `Block @${username}`,
    color: 'danger',
  },
];
