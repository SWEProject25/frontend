import React from 'react';

interface AvatarProps {
  avatarImage?: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'absolute' | 'relative';
  customPosition?: boolean; // Flag to indicate if using custom positioning via className
}

const Avatar = ({
  avatarImage,
  children,
  className = '',
  size = 'lg',
  position = 'absolute',
  customPosition = false,
}: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-[64px] h-[64px]',
    md: 'w-[96px] h-[96px]',
    lg: 'w-[132px] h-[132px]',
  };

  // Only apply default positioning if not using custom positioning
  const positionStyle =
    position === 'absolute' && !customPosition
      ? { left: '16px', top: '134px', zIndex: 1 }
      : position === 'absolute'
        ? { zIndex: 1 }
        : {};

  return (
    <div
      className={`${position} ${sizeClasses[size]} rounded-full border-4 border-[#15202B] ${className}`}
      style={positionStyle}
    >
      <div
        className="w-full h-full rounded-full relative"
        style={{
          backgroundImage: avatarImage ? `url(${avatarImage})` : 'none',
          backgroundColor: '#333639',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Avatar;
