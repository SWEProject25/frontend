import React from 'react';
import Cover from '@/components/generic/Cover';
import Avatar from '@/components/generic/Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import { UserProfile } from '../types/api';
import { useProfile } from '../hooks';

interface ProfileContainerProps {
  profileData: UserProfile;
  isMine: boolean;
}

const ProfileContainer = ({ profileData, isMine }: ProfileContainerProps) => {
  const { handleSaveProfile, isUpdating } = useProfile();

  return (
    <div className="flex flex-col w-full mx-auto relative">
      <Cover coverImage={profileData.banner_image_url || ''} />
      <div className="absolute left-3 sm:left-4 top-[76px] sm:top-[134px] z-10">
        <Avatar
          avatarImage={profileData.profile_image_url}
          name={profileData.name}
          className="border-2 sm:border-4 hover:brightness-75 cursor-pointer"
          position="relative"
          customPosition={true}
        />
      </div>
      <ActionsPanel
        isOwnProfile={isMine}
        isFollowing={false}
        onFollow={() => console.log('Follow clicked')}
        onUnfollow={() => console.log('Unfollow clicked')}
        userData={{
          name: profileData.name,
          bio: profileData.bio || '',
          profileImage: profileData.profile_image_url || '',
          bannerImage: profileData.banner_image_url || '',
          location: profileData.location || '',
          website: profileData.website || '',
          birthDate: profileData.birth_date || '',
        }}
        onSaveProfile={handleSaveProfile}
        isUpdating={isUpdating}
      />
      <UserInfo name={profileData.name} username={profileData.User.username} />
      <div className="flex flex-col items-start px-4 gap-3 w-full">
        <Description bio={profileData.bio || ''} />
        <UserDetails
          joinDate={profileData.created_at}
          location="Giza"
          website="mrfathi.tech"
        />
        <FollowStats followingCount={0} followersCount={0} />
      </div>
    </div>
  );
};

export default ProfileContainer;
