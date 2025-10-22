import React from 'react';

interface AvatarProps {
  avatarImage: string;
}

const Avatar = ({ avatarImage }: AvatarProps) => {
  return (
    <div
      className="absolute w-[132px] h-[132px] rounded-full border-4 border-[#15202B]"
      style={{ left: '16px', top: '134px', zIndex: 1 }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundImage: `url(${avatarImage})`,
          backgroundColor: '#FFFFFF',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export default Avatar;
