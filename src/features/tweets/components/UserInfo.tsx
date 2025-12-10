import Link from 'next/link';
import ProfileCard from './ProfileCard';
import { useState, useRef } from 'react';
import { VerifiedIcon } from '@/components/ui/icons/BrandIcons';

type Direction = 'horizontal' | 'vertical';

type User = {
  id: number;
  name: string;
  username: string;
  verified: boolean;
  avatar: string | null;
  isFollowedByMe?: boolean;
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

  // Timers for delayed hover
  const nameTimer = useRef<NodeJS.Timeout | null>(null);
  const usernameTimer = useRef<NodeJS.Timeout | null>(null);

  const containerClass =
    direction === 'horizontal'
      ? `flex items-center gap-1 min-w-0 flex-1`
      : 'flex flex-col items-start';

  const nameRowClass = 'font-bold hover:underline truncate max-w-[150px]';

  const usernameClass = 'text-gray-400 text-sm relative truncate max-w-[100px]';

  const profileCardClass =
    'absolute left-1/2 transform -translate-x-1/2 top-full z-50 cursor-default';

  const delay = 700;
  const nameCardShow = cardShow && (showNameCard || cardNameHover);
  const usernameCardShow = cardShow && (showUsernameCard || cardUsernameHover);
  return (
    <div className={containerClass} data-testid="tweet-user-info">
      <div className="relative flex-shrink min-w-0">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span
            data-testid="tweet-user-name"
            className={nameRowClass}
            onMouseEnter={() => {
              nameTimer.current = setTimeout(
                () => setShowNameCard(true),
                delay
              );
            }}
            onMouseLeave={() => {
              if (nameTimer.current) {
                clearTimeout(nameTimer.current);
                nameTimer.current = null;
              }
              setShowNameCard(false);
            }}
          >
            <span className="flex items-center gap-0.5">
              <span className="truncate">{data.name}</span>
              {data.verified && (
                <VerifiedIcon className="w-4.5 h-4.5 text-blue-400 flex-shrink-0" />
              )}
            </span>
          </span>
        </Link>
        {nameCardShow && (
          <div
            className={`${profileCardClass} transition-opacity duration-200 ${
              cardShow && (showNameCard || cardNameHover)
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            onMouseEnter={() => {
              setCardNameHover(true);
              if (onHoverCard) onHoverCard(true);
            }}
            onMouseLeave={() => {
              setCardNameHover(false);
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
      <div className="relative flex-shrink min-w-0">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span
            data-testid="tweet-user-username"
            className={usernameClass}
            onMouseEnter={() => {
              usernameTimer.current = setTimeout(
                () => setShowUsernameCard(true),
                delay
              );
            }}
            onMouseLeave={() => {
              if (usernameTimer.current) {
                clearTimeout(usernameTimer.current);
                usernameTimer.current = null;
              }
              setShowUsernameCard(false);
            }}
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
            onMouseEnter={() => {
              setCardUsernameHover(true);
              if (onHoverCard) onHoverCard(true);
            }}
            onMouseLeave={() => {
              setCardUsernameHover(false);
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
