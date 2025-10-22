import React from 'react';

interface CoverProps {
  coverImage: string;
}

const Cover: React.FC<CoverProps> = ({ coverImage }) => {
  return (
    <div
      className="flex flex-row items-start p-8 w-[600px] h-[200px]"
      style={{
        backgroundImage: `url(${coverImage})`,
        backgroundColor: '#FFFFFF',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

export default Cover;
