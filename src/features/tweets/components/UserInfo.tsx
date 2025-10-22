import Link from 'next/link';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import ProfileCard from './ProfileCard';
import { useState } from 'react';

type Direction = 'horizontal' | 'vertical';

export default function UserInfo({
  name,
  username,
  isVerified,
  bio,
  following,
  followers,
  avatar,
  isFollowed,
  direction = 'horizontal',
  cardShow = true,
  onHoverCard,
}: {
  name: string;
  username: string;
  isVerified?: boolean;
  bio?: string;
  following?: number;
  followers?: string;
  avatar?: string;
  isFollowed?: boolean;
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
  return (
    <div className={containerClass}>
      <div className="relative">
        <Link href="/profile">
          <span
            className={nameRowClass}
            onMouseEnter={() => setTimeout(() => setShowNameCard(true), delay)}
            onMouseLeave={() => setTimeout(() => setShowNameCard(false), delay)}
          >
            {name}{' '}
            {isVerified && (
              <RiVerifiedBadgeFill className="inline text-blue-400" size={16} />
            )}
          </span>
        </Link>
        <div
          className={`${profileCardClass} transition-opacity duration-200 ${
            cardShow && (showNameCard || cardNameHover)
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onMouseEnter={(e) => {
            e.preventDefault();
            setCardNameHover(true);
            onHoverCard ? onHoverCard(true) : null;
          }}
          onMouseLeave={() => {
            setCardNameHover(false);
            onHoverCard ? onHoverCard(false) : null;
          }}
          onClick={(e) => e.preventDefault()}
        >
          {cardShow && (showNameCard || cardNameHover) && (
            <ProfileCard
              name={name}
              username={username}
              isVerified={isVerified}
              bio={bio || ''}
              following={following || 0}
              followers={followers || ''}
              avatar={avatar || ''}
              isFollowed={isFollowed}
            />
          )}
        </div>
      </div>
      <div className="relative">
        <Link href="/profile">
          <span
            className={usernameClass}
            onMouseEnter={() =>
              setTimeout(() => setShowUsernameCard(true), 400)
            }
            onMouseLeave={() =>
              setTimeout(() => setShowUsernameCard(false), 400)
            }
          >
            {username}
          </span>
        </Link>
        <div
          className={`${profileCardClass} transition-opacity duration-200 ${
            cardShow && (showUsernameCard || cardUsernameHover)
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onMouseEnter={(e) => {
            e.preventDefault();
            setCardUsernameHover(true);
            onHoverCard ? onHoverCard(true) : null;
          }}
          onMouseLeave={() => {
            setCardUsernameHover(false);
            onHoverCard ? onHoverCard(false) : null;
          }}
          onClick={(e) => e.preventDefault()}
        >
          {cardShow && (showUsernameCard || cardUsernameHover) && (
            <ProfileCard
              name={name}
              username={username}
              isVerified={isVerified}
              bio={bio || ''}
              following={following || 0}
              followers={followers || ''}
              avatar={avatar || ''}
              isFollowed={isFollowed}
            />
          )}
        </div>
      </div>
    </div>
  );
}
