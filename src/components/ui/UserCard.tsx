import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import BlockBtn from '@/components/generic/buttons/BlockBtn';
import MuteBtn from '@/components/generic/buttons/MuteBtn';
import { VerifiedIcon } from '@/components/ui/icons/BrandIcons';
import Icon from './home/Icon';

export interface UserCardProps {
  name: string;
  userId: number;
  handle: string;
  verified?: boolean;
  avatarUrl?: string;
  bio?: string;
  isFollowed?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  actionType?: 'follow' | 'block' | 'mute';
  className?: string;
  onFollowChange?: (userId: number, isFollowed: boolean) => void;
  linkTo?: string; // Optional link to user profile
  'data-testid'?: string;
  fontSize?: string;
}

export default function UserCard({
  name,
  userId,
  handle,
  verified = false,
  avatarUrl,
  bio,
  isFollowed = false,
  isBlocked = false,
  isMuted = false,
  actionType,
  className = '',
  onFollowChange,
  linkTo,

  'data-testid': testId,
  fontSize = 'text-sm',
}: UserCardProps) {
  const userInfoContent = (
    <>
      {/* Avatar */}

      <Avatar
        avatarImage={avatarUrl ?? null}
        name={name}
        size="s"
        position="relative"
        className="border-0 hover:brightness-75 cursor-pointer shrink-0 self-center"
      />

      {/* User Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p
          className={`font-bold text-text-active ${fontSize}  flex items-center gap-1 truncate`}
        >
          <span className="truncate">{name}</span>
          {verified && <VerifiedIcon className="w-4.5 h-4.5 text-blue-400" />}
        </p>
        <p className="text-text-secondary text-sm truncate">{handle}</p>
        {bio && (
          <p className="text-text-secondary text-base mt-1 line-clamp-2">
            {bio}
          </p>
        )}
        {isFollowed && (
          <div className="flex flex-row gap-0.5">
            <Icon
              color="text-text-secondary"
              dataTestId={`${testId}-search-avatar`}
              size="w-3 h-3"
              width="w-3"
              height="h-3"
              disabled={true}
              center={true}
              path="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z"
            />
            <p className="flex flex-row items-center gap-0.5 text-text-secondary text-sm   line-clamp-2">
              Following
            </p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={`flex items-start justify-between w-full gap-3 ${className} `}
      data-testid={testId}
    >
      {linkTo ? (
        <Link
          href={linkTo}
          className="flex items-start gap-3 flex-1 min-w-0"
          data-testid={testId ? `${testId}-link` : undefined}
        >
          {userInfoContent}
        </Link>
      ) : (
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {userInfoContent}
        </div>
      )}

      {/* Action Button */}
      {actionType && (
        <div className="ml-3 shrink-0 self-start">
          {actionType === 'block' ? (
            <BlockBtn userId={userId} isBlocked={isBlocked} />
          ) : actionType === 'mute' ? (
            <MuteBtn userId={userId} isMuted={isMuted} />
          ) : (
            <FollowBtn
              userId={userId}
              isFollowed={isFollowed}
              onFollowChange={onFollowChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
