import React from 'react';
import Cover from './Cover';
import Avatar from './Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import { Profile } from '../types';

interface ProfileContainerProps {
  userData: Profile;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ userData }) => {
  return (
    <div className="flex flex-col w-[600px] mx-auto relative">
      <Cover coverImage={userData.coverImage} />
      <Avatar avatarImage={userData.avatarImage} />
      <ActionsPanel />
      <UserInfo name={userData.name} username={userData.username} />
      <div className="flex flex-col items-start px-4 gap-1 w-[600px] h-[20px]">
        <Description bio={userData.bio} />
        <UserDetails joinDate={userData.joinDate} />
        <FollowStats
          followingCount={userData.followingCount}
          followersCount={userData.followersCount}
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
