import React from 'react';
import Button from './Button';
import Avatar from '@/components/generic/Avatar';

export interface UserCardAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
}

export interface UserCardProps {
  name: string;
  handle: string;
  verified?: boolean;
  avatarUrl?: string;
  bio?: string;
  action: UserCardAction;
  className?: string;
}

export default function UserCard({
  name,
  handle,
  verified = false,
  avatarUrl,
  bio,
  action,
  className = '',
}: UserCardProps) {
  return (
    <div className={`flex items-start gap-3 w-full ${className}`}>
      {/* Avatar */}
      <Avatar
        avatarImage={avatarUrl}
        name={name}
        size="sm"
        position="relative"
        className="border-0 hover:brightness-75 cursor-pointer flex-shrink-0"
      />

      <div className="flex items-start justify-between gap-3 flex-1 min-w-0">
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] text-foreground truncate">
              {name}
            </span>
            {verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="w-[18px] h-[18px] text-primary flex-shrink-0"
              >
                <path d="M10 0a10 10 0 100 20A10 10 0 0010 0zm3.707 7.707l-4.25 4.25a1 1 0 01-1.414 0l-2.25-2.25a1 1 0 111.414-1.414L9 9.586l3.543-3.543a1 1 0 111.414 1.414z" />
              </svg>
            )}
          </div>
          <p className="text-[15px] text-text-inactive truncate">{handle}</p>
          {bio && (
            <p className="text-[15px] text-foreground mt-1 line-clamp-2 break-words">
              {bio}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant={action.variant || 'primary'}
          size="sm"
          onClick={action.onClick}
          loading={action.loading}
          className={`flex-shrink-0 ${
            action.variant === 'outline' && action.label === 'Following'
              ? 'hover:!bg-error/10 hover:!border-error hover:!text-error group'
              : ''
          }`}
        >
          <span
            className={
              action.variant === 'outline' && action.label === 'Following'
                ? 'group-hover:hidden'
                : ''
            }
          >
            {action.label}
          </span>
          {action.variant === 'outline' && action.label === 'Following' && (
            <span className="hidden group-hover:inline">Unfollow</span>
          )}
        </Button>
      </div>
    </div>
  );
}
