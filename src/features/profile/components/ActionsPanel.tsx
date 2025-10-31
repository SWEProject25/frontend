import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';
import EditProfileModal from '../../../components/generic/EditProfileModal';

interface ActionsPanelProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  userData: {
    name: string;
    bio: string;
    profileImage?: string;
    bannerImage?: string;
    location?: string;
    website?: string;
    birthDate?: string;
  };
  onSaveProfile: (data: {
    name: string;
    bio: string;
    profileImage?: File;
    bannerImage?: File;
    location?: string;
    website?: string;
    birthDate?: string;
  }) => void;
  isUpdating?: boolean;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  isOwnProfile,
  isFollowing,
  onFollow,
  onUnfollow,
  userData,
  onSaveProfile,
  isUpdating = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="flex flex-row justify-end items-start p-3 gap-3 w-[600px] h-[60px]">
      {isOwnProfile ? (
        <Button
          variant="outline"
          size="md"
          shape="rounded"
          className="px-5"
          onClick={handleEditProfileClick}
        >
          Edit Profile
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('More clicked')}
          >
            <MoreIcon className="w-5 h-5 text-text-primary" />
          </Button>
          <Button
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('Messages clicked')}
          >
            <MessagesIcon className="w-5 h-5 text-text-primary" />
          </Button>
          {isFollowing ? (
            <Button
              variant={isHovered ? 'error-outline' : 'outline'}
              size="md"
              shape="rounded"
              className="px-5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onUnfollow}
            >
              {isHovered ? 'Unfollow' : 'Following'}
            </Button>
          ) : (
            <Button
              variant="social"
              size="md"
              shape="rounded"
              className="px-5"
              onClick={onFollow}
            >
              Follow
            </Button>
          )}
        </>
      )}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={userData}
        onSave={onSaveProfile}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ActionsPanel;
