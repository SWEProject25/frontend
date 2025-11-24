import React from 'react';
import Image from 'next/image';
import { getColorFromLetter } from '@/constants/colors';

interface AvatarProps {
  avatarImage: string | null;
  name?: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  position?: 'absolute' | 'relative';
  customPosition?: boolean;
}

const Avatar = ({
  avatarImage,
  name,
  children,
  className = 'border-4',
  size = 'lg',
  position = 'absolute',
  customPosition = false,
}: AvatarProps) => {
  const sizeClasses = {
    xs: 'w-[32px] h-[32px]',
    sm: 'w-[48px] h-[48px]',
    md: 'w-[96px] h-[96px] sm:w-[96px] sm:h-[96px]',
    lg: 'w-[100px] h-[100px] sm:w-[132px] sm:h-[132px]',
  };

  const fontSizes = {
    xs: 'text-xl',
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-3xl sm:text-5xl',
  };

  const getInitial = (): { letter: string; color: string } | null => {
    if (!name || avatarImage) return null;
    const firstLetter = name.trim()[0];
    if (!firstLetter) return null;
    return {
      letter: firstLetter.toUpperCase(),
      color: getColorFromLetter(firstLetter),
    };
  };

  const initial = getInitial();

  const positionStyle =
    position === 'absolute' && !customPosition
      ? { left: '12px', top: '80px', zIndex: 1 }
      : position === 'absolute'
        ? { zIndex: 1 }
        : {};

  return (
    <div
      className={`${position} ${sizeClasses[size]} rounded-full border-[#15202B] ${className.includes('border-') ? className : `border-2 sm:border-4 ${className}`}`}
      style={positionStyle}
    >
      <div
        className="w-full h-full rounded-full relative flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: initial ? initial.color : '#333639',
        }}
      >
        {avatarImage ? (
          <Image
            src={avatarImage}
            alt={name || 'Avatar'}
            fill
            className="object-cover"
            unoptimized
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          initial && (
            <span
              className={`${fontSizes[size]} font-bold text-white select-none`}
            >
              {initial.letter}
            </span>
          )
        )}
        {children}
      </div>
    </div>
  );
};

export default Avatar;
