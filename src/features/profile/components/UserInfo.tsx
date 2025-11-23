import React from 'react';

interface UserInfoProps {
  name: string;
  username: string;
}

const UserInfo = ({ name, username }: UserInfoProps) => {
  return (
    <div
      className="flex flex-col items-start p-4 gap-1 w-full min-h-[90px] relative sm:top-0 top-[-7px]"
      data-testid="profile-user-info"
    >
      <div className="flex flex-row items-center gap-1">
        <span
          className="font-inter font-bold text-xl text-[#F7F9F9]"
          data-testid="profile-name"
        >
          {name}
        </span>
      </div>
      <span
        className="font-inter text-sm text-text-placeholder"
        data-testid="profile-username"
      >
        @{username}
      </span>
    </div>
  );
};

export default UserInfo;
