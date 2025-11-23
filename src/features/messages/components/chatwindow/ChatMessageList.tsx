import { useRef, useEffect } from 'react';
import MessageItem from '../MessageItem';
import EmptyConversation from './EmptyConversation';
import TypingIndicator from './TypingIndicator';

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
};

interface ChatMessageListProps {
  messages: Message[];
  conversationName: string;
  conversationUsername: string;
  conversationAvatar: string;
  onDeleteMessage: (messageId: number) => void;
  onEditMessage: (messageId: number, newText: string) => void;
  isMyMessage: (senderId: number) => boolean;
  isTyping?: boolean;
}

export default function ChatMessageList({
  messages,
  conversationName,
  conversationUsername,
  conversationAvatar,
  onDeleteMessage,
  onEditMessage,
  isMyMessage,
  isTyping = false,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <EmptyConversation
          name={conversationName}
          username={conversationUsername}
          avatar={conversationAvatar}
        />
      ) : (
        messages.map((msg) => {
          const isMine = isMyMessage(msg.senderId);

          return (
            <MessageItem
              key={msg.id}
              message={msg}
              isCurrentUser={isMine}
              onDelete={onDeleteMessage}
              onEdit={onEditMessage}
            />
          );
        })
      )}
      {/* Show typing indicator when other user is typing */}
      {isTyping && <TypingIndicator />}
      {/* Invisible div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
}
