import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';
import EditProfileModal from '../../../components/generic/EditProfileModal';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import { useProfile } from '../hooks';

interface ActionsPanelProps {
  isOwnProfile: boolean;
  userData: {
    name: string;
    userId: number;
    bio: string | null;
    isFollowed: boolean;
    profileImage: string | null;
    bannerImage: string | null;
    location: string | null;
    website: string | null;
    birthDate: string;
  };
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  isOwnProfile,
  userData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSaveProfile, isUpdating } = useProfile();

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className="flex flex-row justify-end items-start p-3 gap-3 w-full h-[60px]"
      data-testid="profile-actions-panel"
    >
      {isOwnProfile ? (
        <Button
          data-testid="profile-edit-button"
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
            data-testid="profile-more-button"
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('More clicked')}
          >
            <MoreIcon className="w-5 h-5 text-text-primary" />
          </Button>
          <Button
            data-testid="profile-message-button"
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('Messages clicked')}
          >
            <MessagesIcon className="w-5 h-5 text-text-primary" />
          </Button>
          <FollowBtn
            data-testid="profile-follow-button"
            userId={userData.userId}
            isFollowed={userData.isFollowed}
          />
        </>
      )}
      <EditProfileModal
        data-testid="edit-profile-modal"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={userData}
        onSave={handleSaveProfile}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default ActionsPanel;
