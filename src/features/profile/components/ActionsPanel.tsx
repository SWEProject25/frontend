import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';
import EditProfileModal from '../../../components/generic/EditProfileModal';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import BlockBtn from '@/components/generic/buttons/BlockBtn';
import GenericDropdown from '@/components/generic/Dropdown';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';
import { useProfile } from '../hooks';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/features/messages/api/messages';
import { fetchConversations } from '@/features/messages/api/messages';
import { getProfileDropdownItems } from '../constants/dropdown';
import { useInteractions } from '@/hooks/useInteractions';

interface ActionsPanelProps {
  isOwnProfile: boolean;
  userData: {
    name: string;
    username: string;
    userId: number;
    bio: string | null;
    isFollowed: boolean;
    isFollowingMe: boolean;
    isMuted?: boolean;
    isBlocked?: boolean;
    isBeenBlocked?: boolean;
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
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [showBlockConfirmModal, setShowBlockConfirmModal] = useState(false);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock' | null>(
    null
  );
  const { handleSaveProfile, isUpdating } = useProfile();
  const { muteUser, unmuteUser, blockUser, unblockUser, isBlockLoading } =
    useInteractions();
  const router = useRouter();

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleDropdownAction = async (key: string) => {
    switch (key) {
      case 'mute':
        if (userData.isMuted) {
          await unmuteUser(userData.userId);
        } else {
          await muteUser(userData.userId);
        }
        break;
      case 'block':
        // Show confirmation modal for block/unblock
        setBlockAction(userData.isBlocked ? 'unblock' : 'block');
        setShowBlockConfirmModal(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmBlock = async () => {
    if (blockAction === 'block') {
      await blockUser(userData.userId);
    } else if (blockAction === 'unblock') {
      await unblockUser(userData.userId);
    }
    setShowBlockConfirmModal(false);
    setBlockAction(null);
  };

  const handleMessagesClick = async () => {
    if (isCreatingConversation) return;

    setIsCreatingConversation(true);
    try {
      const conversations = await fetchConversations();

      if (Array.isArray(conversations)) {
        const existingConversation = conversations.find((conv: any) => {
          if (conv.user?.id === userData.userId) {
            return true;
          }
          if (
            conv.user1Id === userData.userId ||
            conv.user2Id === userData.userId
          ) {
            return true;
          }
          return false;
        });

        if (existingConversation) {
          const conversationId =
            existingConversation.conversationId || existingConversation.id;
          router.push(`/messages/${conversationId}`);
          return;
        }
      }

      const result = await createConversation(userData.userId);
      const conversationId =
        result?.data?.id ||
        result?.data?.conversationId ||
        result?.conversationId;

      if (conversationId) {
        router.push(`/messages/${conversationId}`);
      }
    } catch (error) {
      console.error('Error handling conversation:', error);
      // If there's an error, still try to navigate to messages
      router.push('/messages');
    } finally {
      setIsCreatingConversation(false);
    }
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
          <GenericDropdown
            testId="profile-more-dropdown"
            items={getProfileDropdownItems(
              userData.username,
              userData.isMuted || false,
              userData.isBlocked || false
            ).map((item) => ({
              ...item,
              onClick: () => handleDropdownAction(item.key),
            }))}
            showBackdrop={true}
          >
            <Button
              data-testid="profile-more-button"
              variant="outline"
              size="md"
              shape="circle"
            >
              <MoreIcon className="w-5 h-5 text-text-primary" />
            </Button>
          </GenericDropdown>

          {/* Show message button only if not been blocked and not blocking */}
          {!userData.isBeenBlocked && !userData.isBlocked && (
            <Button
              data-testid="profile-message-button"
              variant="outline"
              size="md"
              shape="circle"
              onClick={handleMessagesClick}
              disabled={isCreatingConversation}
            >
              {isCreatingConversation ? (
                <div className="w-5 h-5 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <MessagesIcon className="w-5 h-5 text-text-primary" />
              )}
            </Button>
          )}

          {/* Show Block button if isBlocked is true */}
          {userData.isBlocked && (
            <BlockBtn
              data-testid="profile-block-button"
              userId={userData.userId}
              isBlocked={userData.isBlocked}
            />
          )}

          {/* Show Follow button only if not been blocked and not blocking */}
          {!userData.isBeenBlocked && !userData.isBlocked && (
            <FollowBtn
              data-testid="profile-follow-button"
              userId={userData.userId}
              isFollowed={userData.isFollowed}
              isFollowingMe={userData.isFollowingMe}
            />
          )}
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

      <ConfirmModal
        isOpen={showBlockConfirmModal}
        onClose={() => {
          setShowBlockConfirmModal(false);
          setBlockAction(null);
        }}
        onConfirm={handleConfirmBlock}
        title={blockAction === 'block' ? 'Block user?' : 'Unblock user?'}
        message={
          blockAction === 'block'
            ? 'They will not be able to follow you or view your posts, and you will not see posts or notifications from them.'
            : 'They will be able to follow you and view your posts again.'
        }
        confirmText={blockAction === 'block' ? 'Block' : 'Unblock'}
        cancelText="Cancel"
        confirmButtonClass="bg-block hover:bg-block/90 text-white"
        isLoading={isBlockLoading}
      />
    </div>
  );
};

export default ActionsPanel;
