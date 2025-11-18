import Link from 'next/link';
import ProfileCard from './ProfileCard';
import { useState } from 'react';
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
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
          <span
            className={nameRowClass}
            onMouseEnter={() => setTimeout(() => setShowNameCard(true), delay)}
            onMouseLeave={() => setTimeout(() => setShowNameCard(false), delay)}
          >
            <span className="flex items-center gap-0.5">
              {data.name}
              {data.verified && (
                <VerifiedIcon className="w-4.5 h-4.5 text-blue-400" />
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
      <div className="relative">
        <Link href={`/${data.username}`} onClick={(e) => e.stopPropagation()}>
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
