import React from 'react';

interface UserInfoProps {
  name: string;
  username: string;
}

const UserInfo = ({ name, username }: UserInfoProps) => {
  return (
    <div className="flex flex-col items-start p-4 gap-1 w-full min-h-[80px]">
      <div className="flex flex-row items-center gap-1">
        <span className="font-inter font-bold text-xl text-[#F7F9F9]">
          {name}
        </span>
      </div>
      <span className="font-inter text-sm text-text-placeholder">
        @{username}
      </span>
    </div>
  );
};

export default UserInfo;
