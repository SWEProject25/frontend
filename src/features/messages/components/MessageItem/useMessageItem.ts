import { useState, useCallback } from 'react';

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
};

export function useMessageItem(
  message: Message,
  onDelete: (messageId: number) => void
) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = useCallback(() => {
    onDelete(message.id);
    setShowMenu(false);
  }, [message.id, onDelete]);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  return {
    // State
    showMenu,

    // Handlers
    handleDelete,
    toggleMenu,
    closeMenu,
  };
}
