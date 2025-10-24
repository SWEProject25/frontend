import React from 'react';
import Cover from '../../../components/generic/Cover';
import Avatar from '../../../components/generic/Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import { UserProfile } from '../types/api';
import { mockCurrentUserProfile } from '../../../mocks/mockData';
import { useProfile } from '../hooks';

interface ProfileContainerProps {
  profileData: UserProfile;
}

const ProfileContainer = ({ profileData }: ProfileContainerProps) => {
  const { handleSaveProfile, isUpdating } = useProfile();

  return (
    <div className="flex flex-col w-[600px] mx-auto relative">
      <Cover coverImage={profileData.banner_image_url || ''} />
      <Avatar avatarImage={profileData.profile_image_url || ''} />
      <ActionsPanel
        isOwnProfile={profileData.id === mockCurrentUserProfile.id}
        isFollowing={false}
        onFollow={() => console.log('Follow clicked')}
        onUnfollow={() => console.log('Unfollow clicked')}
        userData={{
          name: profileData.name,
          bio: profileData.bio || '',
          profileImage: profileData.profile_image_url || '',
          bannerImage: profileData.banner_image_url || '',
        }}
        onSaveProfile={handleSaveProfile}
        isUpdating={isUpdating}
      />
      <UserInfo name={profileData.name} username={profileData.User.username} />
      <div className="flex flex-col items-start px-4 gap-3 w-full">
        <Description bio={profileData.bio || ''} />
        <UserDetails joinDate={profileData.created_at} />
        <FollowStats
          followingCount={0} // TODO: Add to API
          followersCount={0} // TODO: Add to API
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
