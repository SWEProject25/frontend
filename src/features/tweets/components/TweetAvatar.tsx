import React, { useState } from 'react';
import Link from 'next/link';
import ProfileCard from './ProfileCard';
import Avatar from '@/components/generic/Avatar';

type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
  isFollowedByMe?: boolean;
};

export default function TweetAvatar({
  data,
  cardShow,
  onHoverCard,
}: {
  data: User;
  cardShow?: boolean;
  onHoverCard?: (hovered: boolean) => void;
}) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const show = (cardShow ?? true) && (showProfileCard || cardHover);
  const delay = 400;

  return (
    <div className="flex-shrink-0" data-testid="tweet-avatar">
      <div className="relative">
        <Link
          href={`/${data.username}`}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setTimeout(() => setShowProfileCard(true), delay)}
          onMouseLeave={() =>
            setTimeout(() => setShowProfileCard(false), delay)
          }
        >
          <Avatar
            data-testid="tweet-avatar-image"
            avatarImage={data.avatar ?? null}
            name={data.name}
            size="sm"
            position="relative"
            className="border-0"
          />
        </Link>
        {show && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 top-full z-50 cursor-default transition-opacity duration-200 ${
              show
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={() => {
              setCardHover(true);
              if (onHoverCard) onHoverCard(true);
            }}
            onMouseLeave={() => {
              setCardHover(false);
              if (onHoverCard) onHoverCard(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data.name && data.username && <ProfileCard userId={data.id} />}
          </div>
        )}
      </div>
    </div>
  );
}
