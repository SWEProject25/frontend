import { useEffect, useState, useCallback } from 'react';
import { useMessageStore } from '../../store/useMessageStore';
import { fetchConversations, createConversation } from '../../api/messages';
import { useAuthStore } from '../../../authentication/store/authStore';

export function useConversationsList(
  onSelectConversation: (id: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [creatingConvo, setCreatingConvo] = useState(false);
  const [lastMessageIds, setLastMessageIds] = useState<Record<number, number>>(
    {}
  );

  const conversations = useMessageStore((s) => s.conversations);
  const allMessages = useMessageStore((s) => s.messages);
  const typingUsers = useMessageStore((s) => s.typingUsers);
  const setConversations = useMessageStore((s) => s.setConversations);

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as { id?: number })?.id ?? null;

  // Update conversations with last message when messages change
  useEffect(() => {
    if (conversations.length === 0) return;

    const currentLastMessageIds: Record<number, number> = {};
    let hasChanges = false;

    const updatedConversations = conversations.map((conv) => {
      const convId = conv.conversationId || conv.id;
      const messages = allMessages[convId!] || [];
      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : undefined;

      if (lastMessage) {
        currentLastMessageIds[convId!] = lastMessage.id;
        if (lastMessageIds[convId!] !== lastMessage.id) {
          hasChanges = true;
        }
      }

      return {
        ...conv,
        lastMessage,
      };
    });

    if (hasChanges) {
      setLastMessageIds(currentLastMessageIds);
      // Sort by most recent message
      const sorted = updatedConversations.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt
          ? new Date(a.lastMessage.createdAt).getTime()
          : 0;
        const bTime = b.lastMessage?.createdAt
          ? new Date(b.lastMessage.createdAt).getTime()
          : 0;
        return bTime - aTime;
      });
      setConversations(sorted);
    }
  }, [allMessages, conversations, lastMessageIds, setConversations]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const conversations = await fetchConversations();
        console.log('📥 Raw conversations from backend:', conversations);

        if (Array.isArray(conversations)) {
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => {
              console.log('📋 Individual conversation:', conv);
              return {
                ...conv,
                id: conv.conversationId || conv.id,
              } as any;
            }
          );
          setConversations(normalizedConversations);
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [setConversations]);

  const handleCreateConversation = useCallback(async () => {
    const userId = parseInt(newUserId);

    if (!userId || isNaN(userId)) {
      alert('Please enter a valid user ID');
      return;
    }

    setCreatingConvo(true);

    try {
      const result = await createConversation(userId);

      const conversationId =
        result?.data?.id ||
        result?.data?.conversationId ||
        result?.conversationId;

      if (conversationId) {
        // Refresh conversations list
        const conversations = await fetchConversations();

        if (Array.isArray(conversations)) {
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => ({
              ...conv,
              id: conv.conversationId || conv.id,
            })
          ) as any[];
          setConversations(normalizedConversations);
        }

        // Select the new conversation
        onSelectConversation(String(conversationId));

        // Close modal and reset
        setShowNewConvoModal(false);
        setNewUserId('');
      }
    } catch (err: unknown) {
      console.error('Error creating conversation:', err);
      alert(
        err instanceof Error ? err.message : 'Failed to create conversation.'
      );
    } finally {
      setCreatingConvo(false);
    }
  }, [newUserId, onSelectConversation, setConversations]);

  const formatTimestamp = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  }, []);

  const getConversationDisplay = useCallback(
    (
      conversation: Record<string, unknown>
    ): {
      displayName: string;
      displayUsername: string;
      displayAvatar: string;
      isVerified: boolean;
      isTyping: boolean;
      lastMessageText: string;
      timestamp: string;
    } => {
      console.log('🔍 Processing conversation for display:', conversation);

      // Backend returns 'user' object, not 'participants' array
      const otherUser = (conversation.user ||
        (conversation.participants as unknown[])?.[0]) as
        | Record<string, unknown>
        | undefined;
      console.log('👤 Other user:', otherUser);

      const displayName = String(
        conversation.name ||
          otherUser?.displayName ||
          otherUser?.name ||
          'Unknown'
      );
      const displayUsername = String(
        conversation.username || otherUser?.username || 'unknown'
      );
      const displayAvatar = String(
        conversation.avatar ||
          otherUser?.profile_image_url ||
          otherUser?.avatar ||
          ''
      );
      const isVerified = !!(conversation.verified || otherUser?.verified);

      const convId = conversation.conversationId || conversation.id;
      const usersTypingInConvo = typingUsers[convId as number] || [];
      const isTyping = usersTypingInConvo.length > 0;

      // Check if last message was sent by current user
      const lastMessage = conversation.lastMessage as
        | Record<string, unknown>
        | undefined;
      let lastMessageText = 'No messages yet';

      if (isTyping) {
        lastMessageText = 'typing...';
      } else if (lastMessage?.text) {
        // If current user sent the message, prefix with "You: "
        if (currentUserId && lastMessage.senderId === currentUserId) {
          lastMessageText = `You: ${String(lastMessage.text)}`;
        } else {
          lastMessageText = String(lastMessage.text);
        }
      }

      const lastMessageObj = conversation.lastMessage as
        | Record<string, unknown>
        | undefined;
      const timestamp = lastMessageObj?.createdAt
        ? formatTimestamp(lastMessageObj.createdAt as string)
        : '';

      return {
        displayName,
        displayUsername,
        displayAvatar,
        isVerified,
        isTyping,
        lastMessageText,
        timestamp,
      };
    },
    [typingUsers, formatTimestamp, currentUserId]
  );

  return {
    // State
    loading,
    error,
    conversations,
    showNewConvoModal,
    newUserId,
    creatingConvo,

    // Setters
    setShowNewConvoModal,
    setNewUserId,

    // Handlers
    handleCreateConversation,
    getConversationDisplay,
  };
}
