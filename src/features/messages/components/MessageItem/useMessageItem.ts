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
  onDelete: (messageId: number) => void,
  onEdit: (messageId: number, newText: string) => void
) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const handleDelete = useCallback(() => {
    onDelete(message.id);
    setShowMenu(false);
  }, [message.id, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowMenu(false);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editText.trim() && editText !== message.text) {
      onEdit(message.id, editText.trim());
    }
    setIsEditing(false);
  }, [editText, message.id, message.text, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditText(message.text);
    setIsEditing(false);
  }, [message.text]);

  const toggleMenu = useCallback(() => {
    setShowMenu((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  return {
    // State
    showMenu,
    isEditing,
    editText,

    // Setters
    setEditText,

    // Handlers
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    toggleMenu,
    closeMenu,
  };
}
