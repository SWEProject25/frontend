'use client';
import ConversationsHeader from './conversationlist/ConversationsHeader';
import ConversationItem from './conversationlist/ConversationItem';
import EmptyConversations from './conversationlist/EmptyConversations';
import NewConversationModal from './conversationlist/NewConversationModal';
import { useConversationsList } from './conversationlist/useConversationsList';

interface ConversationsListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationsList({
  selectedConversation,
  onSelectConversation,
}: ConversationsListProps) {
  const {
    loading,
    error,
    conversations,
    showNewConvoModal,
    newUserId,
    creatingConvo,
    unseenConversationsCount,
    setShowNewConvoModal,
    setNewUserId,
    handleCreateConversation,
    getConversationDisplay,
  } = useConversationsList(onSelectConversation);

  return (
    <div className="w-full h-full flex flex-col bg-black">
      <ConversationsHeader
        unseenConversationsCount={unseenConversationsCount}
      />

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-gray-500">
            Loading conversations...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-8 text-red-500">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <EmptyConversations />
        ) : (
          conversations.map((conversation) => {
            const display = getConversationDisplay(conversation);

            return (
              <ConversationItem
                key={conversation.id}
                id={conversation.id!}
                avatar={display.displayAvatar}
                name={display.displayName}
                username={display.displayUsername}
                isVerified={display.isVerified}
                lastMessageText={display.lastMessageText}
                timestamp={display.timestamp}
                isSelected={Number(selectedConversation) === conversation.id}
                isTyping={display.isTyping}
                unseenCount={display.unseenCount}
                onClick={() => onSelectConversation(String(conversation.id))}
              />
            );
          })
        )}
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
