import React from 'react';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import BlockBtn from '@/components/generic/buttons/BlockBtn';
import MuteBtn from '@/components/generic/buttons/MuteBtn';
import { VerifiedIcon } from '@/components/ui/icons/BrandIcons';
import { LikeIconFilled, RetweetIcon } from '@/components/ui/icons/UIIcons';

export interface UserCardProps {
  name: string;
  userId: number;
  handle: string;
  verified?: boolean;
  avatarUrl?: string;
  bio?: string;
  isFollowed?: boolean;
  isFollowingMe?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  actionType?: 'follow' | 'block' | 'mute' | 'like' | 'repost';
  className?: string;
  onFollowChange?: (userId: number, isFollowed: boolean) => void;
  linkTo?: string;
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
  isFollowingMe = false,
  isBlocked = false,
  isMuted = false,
  actionType,
  className = '',
  onFollowChange,
  linkTo,

  'data-testid': testId,
  fontSize = 'text-sm',
}: Readonly<UserCardProps>) {
  const renderActionButton = () => {
    if (!actionType) return null;

    if (actionType === 'block') {
      return <BlockBtn userId={userId} isBlocked={isBlocked} />;
    }

    if (actionType === 'mute') {
      return <MuteBtn userId={userId} isMuted={isMuted} />;
    }

    if (actionType === 'like') {
      return (
        <div className="p-2">
          <LikeIconFilled className="w-5 h-5 text-rose-400" />
        </div>
      );
    }

    if (actionType === 'repost') {
      return (
        <div className="p-2">
          <RetweetIcon className="w-5 h-5 text-green-500" />
        </div>
      );
    }

    // Default: follow action
    return (
      <FollowBtn
        userId={userId}
        isFollowed={isFollowed}
        isFollowingMe={isFollowingMe}
        onFollowChange={onFollowChange}
      />
    );
  };

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
        <div className="ml-3 shrink-0 self-start">{renderActionButton()}</div>
      )}
    </div>
  );
}
