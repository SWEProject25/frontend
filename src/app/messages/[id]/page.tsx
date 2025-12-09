'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ChatWindow from '@/features/messages/components/ChatWindow';
import ConversationsList from '@/features/messages/components/ConversationsList';
import NewConversationModal from '@/features/messages/components/conversationlist/NewConversationModal';
import {
  createConversation,
  fetchConversations,
} from '@/features/messages/api/messages';
import { useMessageStore } from '@/features/messages/store/useMessageStore';
import { useSyncDMNotifications } from '@/features/messages/hooks/useSyncDMNotifications';
import '@/features/messages/utils/mockMessages';

export default function MessagePage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string;

  // Sync DM notifications with message store
  useSyncDMNotifications();
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [creatingConvo, setCreatingConvo] = useState(false);

  const setConversations = useMessageStore((s) => s.setConversations);

  if (!conversationId) {
    router.push('/messages');
    return null;
  }

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

  return (
    <div className="flex h-screen bg-black w-full">
      <div className="hidden lg:flex lg:w-[400px] border-r border-gray-800 shrink-0 flex-col overflow-y-auto">
        <ConversationsList
          selectedConversation={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewMessageClick={() => setShowNewConvoModal(true)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-b border-gray-800 shrink-0">
          <div className="p-4">
            <button
              onClick={() => router.push('/messages')}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Back to messages"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Messages</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow conversationId={conversationId} />
        </div>
      </div>

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
