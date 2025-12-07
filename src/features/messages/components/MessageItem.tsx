'use client';
import { MoreHorizontal } from 'lucide-react';
import MessageBubble from './MessageItem/MessageBubble';
import MessageMenu from './MessageItem/MessageMenu';
import { useMessageItem } from './MessageItem/useMessageItem';

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
};

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
  onDelete: (messageId: number) => void;
}

export default function MessageItem({
  message,
  isCurrentUser,
  onDelete,
}: MessageItemProps) {
  const { showMenu, handleDelete, toggleMenu, closeMenu } = useMessageItem(
    message,
    onDelete
  );

  return (
    <div
      id={`message-item-${message.id}`}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseLeave={closeMenu}
    >
      <div className="relative max-w-[70%]">
        <MessageBubble message={message} isCurrentUser={isCurrentUser} />

        {/* More button - shows on hover */}
        {isCurrentUser && (
          <button
            id={`message-more-${message.id}`}
            onClick={toggleMenu}
            className={`
              absolute top-1 -left-8
              opacity-0 group-hover:opacity-100
              transition-opacity duration-200
              p-1 rounded-full hover:bg-gray-700
              text-gray-400 hover:text-white
            `}
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}

        <MessageMenu show={showMenu} onDelete={handleDelete} />
      </div>
    </div>
  );
}
