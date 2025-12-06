'use client';
import ConversationsHeader from './conversationlist/ConversationsHeader';
import ConversationItemWithUnseen from './ConversationItemWithUnseen';
import EmptyConversations from './conversationlist/EmptyConversations';
import { useConversationsList } from './conversationlist/useConversationsList';

interface ConversationsListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewMessageClick?: () => void;
}

export default function ConversationsList({
  selectedConversation,
  onSelectConversation,
  onNewMessageClick,
}: ConversationsListProps) {
  const { loading, error, conversations, getConversationDisplay } =
    useConversationsList(onSelectConversation);

  return (
    <div
      id="conversations-list"
      className="w-full h-full flex flex-col bg-black"
    >
      <ConversationsHeader
        onNewMessageClick={onNewMessageClick || (() => {})}
      />

      {/* Conversations List */}
      <div id="conversations-list-items" className="flex-1 overflow-y-auto">
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
              <ConversationItemWithUnseen
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
                onClick={() => onSelectConversation(String(conversation.id))}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
