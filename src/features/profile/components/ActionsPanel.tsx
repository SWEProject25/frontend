import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';
import EditProfileModal from '../../../components/generic/EditProfileModal';
import FollowBtn from '@/components/generic/buttons/FollowBtn';
import { useProfile } from '../hooks';
import { useRouter } from 'next/navigation';
import { createConversation } from '@/features/messages/api/messages';
import { fetchConversations } from '@/features/messages/api/messages';

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
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const { handleSaveProfile, isUpdating } = useProfile();
  const router = useRouter();

  const handleEditProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleMessagesClick = async () => {
    if (isCreatingConversation) return;

    setIsCreatingConversation(true);
    try {
      // First, check if a conversation already exists with this user
      const conversations = await fetchConversations();

      if (Array.isArray(conversations)) {
        // Find existing conversation with this user
        const existingConversation = conversations.find((conv: any) => {
          // Check if the conversation's user matches the target user
          if (conv.user?.id === userData.userId) {
            return true;
          }
          // Also check user1Id and user2Id if available
          if (
            conv.user1Id === userData.userId ||
            conv.user2Id === userData.userId
          ) {
            return true;
          }
          return false;
        });

        if (existingConversation) {
          // Conversation exists, navigate to it
          const conversationId =
            existingConversation.conversationId || existingConversation.id;
          router.push(`/messages/${conversationId}`);
          return;
        }
      }

      // No existing conversation, create a new one
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
    <div className="flex flex-row justify-end items-start p-3 gap-3 w-full h-[60px]">
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
            onClick={handleMessagesClick}
            disabled={isCreatingConversation}
          >
            {isCreatingConversation ? (
              <div className="w-5 h-5 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <MessagesIcon className="w-5 h-5 text-text-primary" />
            )}
          </Button>
          <FollowBtn
            userId={userData.userId}
            isFollowed={userData.isFollowed}
          />
        </>
      )}
      <EditProfileModal
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
