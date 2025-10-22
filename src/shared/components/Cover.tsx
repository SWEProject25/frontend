import React from 'react';

interface CoverProps {
  coverImage?: string;
}

const Cover = ({ coverImage }: CoverProps) => {
  return (
    <div
      className="flex flex-row items-start p-8 w-full h-[200px]"
      style={{
        backgroundImage: coverImage ? `url(${coverImage})` : 'none',
        backgroundColor: '#333639',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default Cover;
