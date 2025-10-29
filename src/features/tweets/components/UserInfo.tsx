import Link from 'next/link';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import ProfileCard from './ProfileCard';
import { useState } from 'react';

type Direction = 'horizontal' | 'vertical';

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

export default function UserInfo({
  data,
  direction = 'horizontal',
  cardShow = true,
  onHoverCard,
}: {
  data: User;
  direction?: Direction;
  cardShow?: boolean;
  onHoverCard?: (hovered: boolean) => void;
}) {
  const [showNameCard, setShowNameCard] = useState(false);
  const [showUsernameCard, setShowUsernameCard] = useState(false);
  const [cardNameHover, setCardNameHover] = useState(false);
  const [cardUsernameHover, setCardUsernameHover] = useState(false);

  const containerClass =
    direction === 'horizontal'
      ? 'flex items-center gap-1'
      : 'flex flex-col items-start';

  const nameRowClass = 'font-bold hover:underline';

  const usernameClass = 'text-gray-400 text-sm relative';

  const profileCardClass =
    'absolute left-1/2 transform -translate-x-1/2 top-full z-50 cursor-default';

  const delay = 400;
  const nameCardShow = cardShow && (showNameCard || cardNameHover);
  const usernameCardShow = cardShow && (showUsernameCard || cardUsernameHover);
  return (
    <div className={containerClass}>
      <div className="relative">
        <Link href="/profile" onClick={(e) => e.stopPropagation()}>
          <span
            className={nameRowClass}
            onMouseEnter={() => setTimeout(() => setShowNameCard(true), delay)}
            onMouseLeave={() => setTimeout(() => setShowNameCard(false), delay)}
          >
            {data.name}{' '}
            {data.isVerified && (
              <RiVerifiedBadgeFill className="inline text-blue-400" size={16} />
            )}
          </span>
        </Link>
        {nameCardShow && (
          <div
            className={`${profileCardClass} transition-opacity duration-200 ${
              cardShow && (showNameCard || cardNameHover)
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={(e) => {
              setCardNameHover(true);
              onHoverCard ? onHoverCard(true) : null;
            }}
            onMouseLeave={() => {
              setCardNameHover(false);
              onHoverCard ? onHoverCard(false) : null;
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data.name && data.username && <ProfileCard data={data} />}
          </div>
        )}
      </div>
      <div className="relative">
        <Link href="/profile" onClick={(e) => e.stopPropagation()}>
          <span
            className={usernameClass}
            onMouseEnter={() =>
              setTimeout(() => setShowUsernameCard(true), 400)
            }
            onMouseLeave={() =>
              setTimeout(() => setShowUsernameCard(false), 400)
            }
          >
            {data.username}
          </span>
        </Link>
        {usernameCardShow && (
          <div
            className={`${profileCardClass} transition-opacity duration-200 ${
              cardShow && (showUsernameCard || cardUsernameHover)
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={(e) => {
              setCardUsernameHover(true);
              onHoverCard ? onHoverCard(true) : null;
            }}
            onMouseLeave={() => {
              setCardUsernameHover(false);
              onHoverCard ? onHoverCard(false) : null;
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {data.name && data.username && <ProfileCard data={data} />}
          </div>
        )}
      </div>
    </div>
  );
}
