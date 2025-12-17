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
  const nameLeaveTimer = useRef<NodeJS.Timeout | null>(null);
  const usernameLeaveTimer = useRef<NodeJS.Timeout | null>(null);

  const containerClass =
    direction === 'horizontal'
      ? `flex items-center gap-1 min-w-0 flex-1`
      : 'flex flex-col items-start';

  const nameRowClass = 'font-bold hover:underline truncate max-w-[150px]';

  const usernameClass = 'text-gray-400 text-sm relative truncate max-w-[100px]';

  const profileCardClass =
    'absolute left-0 top-full z-[9999] cursor-default mt-2';

  const delay = 800;
  const leaveDelay = 300; // Delay before hiding card on mouse leave
  const nameCardShow = cardShow && (showNameCard || cardNameHover);
  const usernameCardShow = cardShow && (showUsernameCard || cardUsernameHover);
  return (
    <div className={containerClass} data-testid="tweet-user-info">
      <div className="relative shrink min-w-0">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span
            data-testid="tweet-user-name"
            className={nameRowClass}
            onMouseEnter={() => {
              if (nameLeaveTimer.current) {
                clearTimeout(nameLeaveTimer.current);
                nameLeaveTimer.current = null;
              }
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
              nameLeaveTimer.current = setTimeout(() => {
                setShowNameCard(false);
              }, leaveDelay);
            }}
          >
            <span className="flex items-center gap-0.5">
              <span className="truncate">{data.name}</span>
              {data.verified && (
                <VerifiedIcon className="w-4.5 h-4.5 text-blue-400 shrink-0" />
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
            style={{ minWidth: '300px', maxWidth: '90vw' }}
            onMouseEnter={() => {
              if (nameLeaveTimer.current) {
                clearTimeout(nameLeaveTimer.current);
                nameLeaveTimer.current = null;
              }
              setCardNameHover(true);
              if (onHoverCard) onHoverCard(true);
            }}
            onMouseLeave={() => {
              setCardNameHover(false);
              setShowNameCard(false);
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
      <div className="relative shrink min-w-0">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span
            data-testid="tweet-user-username"
            className={usernameClass}
            onMouseEnter={() => {
              if (usernameLeaveTimer.current) {
                clearTimeout(usernameLeaveTimer.current);
                usernameLeaveTimer.current = null;
              }
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
              usernameLeaveTimer.current = setTimeout(() => {
                setShowUsernameCard(false);
              }, leaveDelay);
            }}
          >
            <span className="hidden xs:inline">{data.username}</span>
            <span className="inline xs:hidden">
              {data.username.length > 10
                ? `${data.username.slice(0, 10)}...`
                : data.username}
            </span>
          </span>
        </Link>
        {usernameCardShow && (
          <div
            className={`${profileCardClass} transition-opacity duration-200 ${
              cardShow && (showUsernameCard || cardUsernameHover)
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
            style={{ minWidth: '300px', maxWidth: '90vw' }}
            onMouseEnter={() => {
              if (usernameLeaveTimer.current) {
                clearTimeout(usernameLeaveTimer.current);
                usernameLeaveTimer.current = null;
              }
              setCardUsernameHover(true);
              if (onHoverCard) onHoverCard(true);
            }}
            onMouseLeave={() => {
              setCardUsernameHover(false);
              setShowUsernameCard(false);
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
