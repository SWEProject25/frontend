import React from 'react';
import Cover from '../../../components/generic/Cover';
import Avatar from '../../../components/generic/Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import { Profile } from '../types';

interface ProfileContainerProps {
  userData: Profile;
}

const ProfileContainer = ({ userData }: ProfileContainerProps) => {
  const handleSaveProfile = (data: {
    name: string;
    bio: string;
    profileImage?: File;
    bannerImage?: File;
  }) => {
    console.log('Saving profile data:', data);
    // Implement API call or state update here
  };

  return (
    <div className="flex flex-col w-[600px] mx-auto relative">
      <Cover coverImage={userData.coverImage} />
      <Avatar avatarImage={userData.avatarImage} />
      <ActionsPanel
        isOwnProfile={true}
        isFollowing={false}
        onFollow={() => console.log('Follow clicked')}
        onUnfollow={() => console.log('Unfollow clicked')}
        userData={userData}
        onSaveProfile={handleSaveProfile}
      />
      <UserInfo name={userData.name} username={userData.username} />
      <div className="flex flex-col items-start px-4 gap-3 w-full">
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
