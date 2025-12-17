'use client';
import React, { useState } from 'react';
import Cover from '@/components/generic/Cover';
import Avatar from '@/components/generic/Avatar';
import ActionsPanel from './ActionsPanel';
import UserInfo from './UserInfo';
import Description from './Description';
import UserDetails from './UserDetails';
import FollowStats from './FollowStats';
import ImageModal from '@/components/generic/ImageModal';
import { UserProfile } from '../types/api';
import type { MediaItem } from '@/features/tweets/types';

interface ProfileContainerProps {
  profileData: UserProfile;
  isMine: boolean;
}

const ProfileContainer = ({ profileData, isMine }: ProfileContainerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageType, setModalImageType] = useState<'profile' | 'banner'>(
    'profile'
  );

  const userData = {
    name: profileData.name,
    userId: profileData.User.id,
    username: profileData.User.username,
    bio: profileData.bio,
    isFollowed: profileData.is_followed_by_me,
    isFollowingMe: profileData.is_following_me,
    isMuted: profileData.is_muted_by_me ?? false,
    isBlocked: profileData.is_blocked_by_me ?? false,
    isBeenBlocked: profileData.is_been_blocked ?? false,
    profileImage: profileData.profile_image_url,
    bannerImage: profileData.banner_image_url,
    location: profileData.location,
    website: profileData.website,
    birthDate: profileData.birth_date,
  };

  const openModal = (type: 'profile' | 'banner') => {
    setModalImageType(type);
    setIsModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const getModalMedia = () => {
    if (modalImageType === 'profile' && profileData.profile_image_url) {
      return [
        {
          url: profileData.profile_image_url,
          type: 'image',
        } satisfies MediaItem,
      ];
    }
    if (modalImageType === 'banner' && profileData.banner_image_url) {
      return [
        {
          url: profileData.banner_image_url,
          type: 'image',
        } satisfies MediaItem,
      ];
    }
    return [] as MediaItem[];
  };

  return (
    <div
      className="flex flex-col w-full mx-auto relative"
      data-testid="profile-container"
    >
      <div
        onClick={() => profileData.banner_image_url && openModal('banner')}
        className={
          profileData.banner_image_url ? 'cursor-pointer' : 'cursor-default'
        }
      >
        <Cover
          coverImage={profileData.banner_image_url || ''}
          data-testid="profile-cover"
        />
      </div>
      <div
        className="absolute left-3 sm:left-4 top-[76px] sm:top-[134px] z-10"
        onClick={() => profileData.profile_image_url && openModal('profile')}
      >
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
          userId={profileData.User.id}
          isMine={isMine}
        />
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        media={getModalMedia()}
        currentIndex={0}
        showNavigation={false}
        showCounter={false}
      />
    </div>
  );
};

export default ProfileContainer;
