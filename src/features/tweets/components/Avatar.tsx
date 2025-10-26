import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileCard from './ProfileCard';

type User = {
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  following?: number;
  followers?: string;
  isVerified: boolean;
  isFollowed?: boolean;
};

export default function Avatar({
  size = 48,
  data,
  cardShow,
  onHoverCard,
  disableLink = false,
}: {
  size?: number;
  data: User;
  cardShow?: boolean;
  onHoverCard?: (hovered: boolean) => void;
  disableLink?: boolean;
}) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const show = (cardShow ?? true) && (showProfileCard || cardHover);
  const delay = 400;

  const handleClick = (e: React.MouseEvent) => {
    if (disableLink) {
      e.stopPropagation();
      window.location.href = '/profile';
    }
  };

  const content = (
    <Image
      width={size || 48}
      height={size || 48}
      src={data.avatar || '/default-avatar.png'}
      alt="User avatar"
      className="w-12 h-12 rounded-full cursor-pointer"
    />
  );

  return (
    <div className="flex-shrink-0">
      <div className="relative">
        {disableLink ? (
          <div
            onMouseEnter={() =>
              setTimeout(() => setShowProfileCard(true), delay)
            }
            onMouseLeave={() =>
              setTimeout(() => setShowProfileCard(false), delay)
            }
            onClick={handleClick}
          >
            {content}
          </div>
        ) : (
          <Link
            href="/profile"
            onMouseEnter={() =>
              setTimeout(() => setShowProfileCard(true), delay)
            }
            onMouseLeave={() =>
              setTimeout(() => setShowProfileCard(false), delay)
            }
          >
            {content}
          </Link>
        )}
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
          {show && data.name && data.username && <ProfileCard data={data} />}
        </div>
      </div>
    </div>
  );
}
