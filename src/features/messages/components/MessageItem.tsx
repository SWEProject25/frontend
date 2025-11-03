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
  onEdit: (messageId: number, newText: string) => void;
}

export default function MessageItem({
  message,
  isCurrentUser,
  onDelete,
  onEdit,
}: MessageItemProps) {
  const {
    showMenu,
    isEditing,
    editText,
    setEditText,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    toggleMenu,
    closeMenu,
  } = useMessageItem(message, onDelete, onEdit);

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}
      onMouseLeave={closeMenu}
    >
      <div className="relative max-w-[70%]">
        <MessageBubble
          message={message}
          isCurrentUser={isCurrentUser}
          isEditing={isEditing}
          editText={editText}
          onEditTextChange={setEditText}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />

        {/* More button - shows on hover */}
        {isCurrentUser && (
          <button
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

        <MessageMenu
          show={showMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
