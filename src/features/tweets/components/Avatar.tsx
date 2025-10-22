import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileCard from './ProfileCard';

export default function Avatar({
  image,
  size,
  name,
  username,
  isVerified,
  bio,
  following,
  followers,
  isFollowed,
  cardShow = true,
  onHoverCard,
}: {
  image?: string;
  size?: number;
  name?: string;
  username?: string;
  isVerified?: boolean;
  bio?: string;
  following?: number;
  followers?: string;
  isFollowed?: boolean;
  cardShow?: boolean;
  onHoverCard?: (hovered: boolean) => void;
}) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const show = cardShow && (showProfileCard || cardHover);
  const delay = 400;
  return (
    <div className="flex-shrink-0">
      <div className="relative">
        <Link
          href="/profile"
          onMouseEnter={() => setTimeout(() => setShowProfileCard(true), delay)}
          onMouseLeave={() =>
            setTimeout(() => setShowProfileCard(false), delay)
          }
        >
          <Image
            width={size || 48}
            height={size || 48}
            src={image || '/default-avatar.png'}
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
        </Link>
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 top-full z-50 cursor-default transition-opacity duration-200 ${
            show
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onMouseEnter={(e) => {
            e.preventDefault();
            setCardHover(true);
            onHoverCard ? onHoverCard(true) : null;
          }}
          onMouseLeave={() => {
            setCardHover(false);
            onHoverCard ? onHoverCard(false) : null;
          }}
          onClick={(e) => e.preventDefault()}
        >
          {name && username && (
            <ProfileCard
              name={name}
              username={username}
              isVerified={isVerified || false}
              bio={bio || ''}
              following={following || 0}
              followers={followers || '0'}
              avatar={image || '/default-avatar.png'}
              isFollowed={isFollowed || false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
