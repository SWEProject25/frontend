import React from 'react';
import Cover from '@/components/generic/Cover';
import Avatar from '@/components/generic/Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import { UserProfile } from '../types/api';

interface ProfileContainerProps {
  profileData: UserProfile;
  isMine: boolean;
}

const ProfileContainer = ({ profileData, isMine }: ProfileContainerProps) => {
  const userData = {
    name: profileData.name,
    userId: profileData.User.id,
    bio: profileData.bio,
    isFollowed: profileData.is_followed_by_me,
    profileImage: profileData.profile_image_url,
    bannerImage: profileData.banner_image_url,
    location: profileData.location,
    website: profileData.website,
    birthDate: profileData.birth_date,
  };
  return (
    <div
      className="flex flex-col w-full mx-auto relative"
      data-testid="profile-container"
    >
      <Cover
        coverImage={profileData.banner_image_url || ''}
        data-testid="profile-cover"
      />
      <div className="absolute left-3 sm:left-4 top-[76px] sm:top-[134px] z-10">
        <Avatar
          data-testid="profile-avatar"
          avatarImage={profileData.profile_image_url}
          name={profileData.name}
          className="border-2 sm:border-4 hover:brightness-75 cursor-pointer"
          position="relative"
          customPosition={true}
        />
      </div>
      <ActionsPanel isOwnProfile={isMine} userData={userData} />
      <UserInfo name={profileData.name} username={profileData.User.username} />
      <div
        className="flex flex-col items-start px-4 gap-3 w-full"
        data-testid="profile-details"
      >
        <Description bio={profileData.bio} />
        <UserDetails
          joinDate={profileData.created_at}
          location={profileData.location}
          website={profileData.website}
        />
        <FollowStats
          followingCount={profileData.following_count}
          followersCount={profileData.followers_count}
          username={profileData.User.username}
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
