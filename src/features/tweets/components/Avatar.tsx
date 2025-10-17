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
  onProfileCardHover,
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
  onProfileCardHover?: (hovered: boolean) => void;
}) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  React.useEffect(() => {
    if (onProfileCardHover) {
      onProfileCardHover(showProfileCard || cardHover);
    }
  }, [showProfileCard, cardHover, onProfileCardHover]);

  const show = showProfileCard || cardHover;

  return (
    <div className="flex-shrink-0">
      <div
        className="relative"
        onMouseEnter={() => setShowProfileCard(true)}
        onMouseLeave={() => setShowProfileCard(false)}
      >
        <Link href="/profile">
          <Image
            width={size || 48}
            height={size || 48}
            src={image || '/default-avatar.png'}
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
        </Link>
        {show && name && username && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0.5 z-50 cursor-default"
            onMouseEnter={(e) => {
              e.preventDefault();
              setCardHover(true);
            }}
            onMouseLeave={() => setCardHover(false)}
            onClick={(e) => e.preventDefault()}
          >
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
          </div>
        )}
      </div>
    </div>
  );
}
