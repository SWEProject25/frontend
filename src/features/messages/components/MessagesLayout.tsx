'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ConversationsList from './ConversationsList';
import WelcomeScreen from './WelcomeScreen';
import NewConversationModal from './conversationlist/NewConversationModal';
import { useMessages } from '../hooks/useMessages';
import { createConversation, fetchConversations } from '../api/messages';
import { useMessageStore } from '../store/useMessageStore';

export default function MessagesLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isMainMessagesPage = pathname === '/messages';
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [creatingConvo, setCreatingConvo] = useState(false);

  const setConversations = useMessageStore((s) => s.setConversations);

  useMessages((err) => {
    console.error('Socket connection error:', err);
  });

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  const handleCreateConversation = async () => {
    if (!newUserId) return;

    setCreatingConvo(true);
    try {
      // Create conversation via API first
      const response = await createConversation(Number(newUserId));

      // Handle multiple possible response structures
      const conversationId =
        response?.data?.id ||
        response?.data?.conversationId ||
        response?.conversationId;

      if (conversationId) {
        // Refresh conversations list to get the new conversation with user details
        try {
          const conversations = await fetchConversations();
          if (Array.isArray(conversations)) {
            const normalizedConversations = conversations.map((conv: any) => ({
              ...conv,
              id: conv.conversationId || conv.id,
            }));
            setConversations(normalizedConversations);
          }
        } catch (refreshError) {
          console.error('Failed to refresh conversations:', refreshError);
        }

        router.push(`/messages/${conversationId}`);
      } else {
        // Fallback if response structure is different
        router.push(`/messages/${newUserId}`);
      }

      setShowNewConvoModal(false);
      setNewUserId('');
    } catch (error: any) {
      console.error('Failed to create conversation:', error);

      // If conversation already exists (409), try to navigate anyway
      if (error.message?.includes('already exists')) {
        router.push(`/messages/${newUserId}`);
        setShowNewConvoModal(false);
        setNewUserId('');
      } else {
        // Show error to user
        alert(error.message || 'Failed to create conversation');
      }
    } finally {
      setCreatingConvo(false);
    }
  };

  const handleOpenNewMessage = () => {
    setShowNewConvoModal(true);
  };

  return (
    <div id="messages-layout" className="flex h-screen bg-black">
      <div
        className={`${isMainMessagesPage ? 'w-full md:w-[400px]' : 'hidden lg:block lg:w-[400px]'} border-r border-gray-800 shrink-0`}
      >
        <ConversationsList
          selectedConversation={null}
          onSelectConversation={handleSelectConversation}
          onNewMessageClick={handleOpenNewMessage}
        />
      </div>

      {isMainMessagesPage && (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <WelcomeScreen onNewMessageClick={handleOpenNewMessage} />
        </div>
      )}

      <NewConversationModal
        show={showNewConvoModal}
        userId={newUserId}
        loading={creatingConvo}
        onClose={() => {
          setShowNewConvoModal(false);
          setNewUserId('');
        }}
        onUserIdChange={setNewUserId}
        onCreate={handleCreateConversation}
      />
    </div>
  );
}
