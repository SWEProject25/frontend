import React from 'react';

interface CoverProps {
  coverImage?: string;
  children?: React.ReactNode;
  className?: string;
}

const Cover = ({ coverImage, children, className = '' }: CoverProps) => {
  return (
    <div
      className={`relative flex flex-row items-start p-4 sm:p-8 w-full h-[120px] sm:h-[200px] ${className}`}
      style={{
        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
        backgroundColor: '#333639',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
};

export default Cover;
