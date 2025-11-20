import React from 'react';
import Avatar from '@/components/generic/Avatar';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import BlockBtn from '@/components/generic/buttons/BlockBtn';
import MuteBtn from '@/components/generic/buttons/MuteBtn';

export interface UserCardProps {
  name: string;
  userId: number;
  handle: string;
  verified?: boolean;
  avatarUrl?: string;
  isFollowed?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  actionType?: 'follow' | 'block' | 'mute';
  className?: string;
}

export default function UserCard({
  name,
  userId,
  handle,
  verified = false,
  avatarUrl,
  isFollowed = false,
  isBlocked = false,
  isMuted = false,
  actionType = 'follow',
  className = '',
}: UserCardProps) {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        <Avatar
          avatarImage={avatarUrl ?? null}
          name={name}
          size="xs"
          position="relative"
          className="border-0 hover:brightness-75 cursor-pointer"
        />

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-text-active text-sm flex items-center gap-1 truncate">
            <span className="truncate">{name}</span>
            {verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="w-4 h-4 text-primary flex-shrink-0"
              >
                <path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm3.707 7.707l-4.25 4.25a1 1 0 01-1.414 0l-2.25-2.25a1 1 0 111.414-1.414L9 9.586l3.543-3.543a1 1 0 111.414 1.414z" />
              </svg>
            )}
          </p>
          <p className="text-text-secondary text-sm truncate">{handle}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="ml-3 flex-shrink-0">
        {actionType === 'block' ? (
          <BlockBtn userId={userId} isBlocked={isBlocked} />
        ) : actionType === 'mute' ? (
          <MuteBtn userId={userId} isMuted={isMuted} />
        ) : (
          <FollowBtn userId={userId} isFollowed={isFollowed} />
        )}
      </div>
    </div>
  );
}
