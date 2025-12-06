import { useEffect, useState, useCallback, useMemo } from 'react';
import { useMessageStore } from '../../store/useMessageStore';
import { fetchConversations, createConversation } from '../../api/messages';
import { useAuthStore } from '../../../authentication/store/authStore';
import { useTotalUnseenCount } from '../../hooks/useUnseenCounts';

export function useConversationsList(
  onSelectConversation: (id: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [creatingConvo, setCreatingConvo] = useState(false);

  const conversationsRaw = useMessageStore((s) => s.conversations);
  const typingUsers = useMessageStore((s) => s.typingUsers);
  const allMessages = useMessageStore((s) => s.messages);
  const setConversations = useMessageStore((s) => s.setConversations);

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as { id?: number })?.id ?? null;

  // Fetch total unseen count from API
  const { data: totalUnseenCount = 0 } = useTotalUnseenCount(!!user);

  // Sort conversations by most recent message
  const conversations = useMemo(() => {
    return [...conversationsRaw].sort((a, b) => {
      const aLastMessage = a.lastMessage as Record<string, unknown> | undefined;
      const bLastMessage = b.lastMessage as Record<string, unknown> | undefined;

      const aTime = aLastMessage?.createdAt
        ? new Date(aLastMessage.createdAt as string).getTime()
        : 0;
      const bTime = bLastMessage?.createdAt
        ? new Date(bLastMessage.createdAt as string).getTime()
        : 0;

      // Sort in descending order (most recent first)
      return bTime - aTime;
    });
  }, [conversationsRaw]);

  // Helper to check if a conversation has any unseen messages
  const hasUnseenMessages = useCallback(
    (conversationId: number): boolean => {
      const messages = allMessages[conversationId] || [];

      // Check if there are any messages that are not seen and not sent by current user
      const hasUnseen = messages.some(
        (msg) => !msg.isSeen && msg.senderId !== currentUserId
      );

      return hasUnseen;
    },
    [allMessages, currentUserId]
  );

  // Calculate total number of conversations with unseen messages
  const unseenConversationsCount = useMemo(() => {
    return conversations.filter((conv) => {
      const convId = conv.conversationId || conv.id;
      return convId ? hasUnseenMessages(convId) : false;
    }).length;
  }, [conversations, hasUnseenMessages]);

  // Load conversations on mount - only if not already loaded
  useEffect(() => {
    // Skip if conversations are already loaded
    if (conversations.length > 0) {
      return;
    }

    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const conversations = await fetchConversations();

        if (Array.isArray(conversations)) {
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => {
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
  }, [setConversations, conversations.length]);

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
      unseenCount: number;
    } => {
      // Backend returns 'user' object, not 'participants' array
      const otherUser = (conversation.user ||
        (conversation.participants as unknown[])?.[0]) as
        | Record<string, unknown>
        | undefined;

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

      // Check if conversation has unseen messages (returns 1 if yes, 0 if no)
      const unseenCount = hasUnseenMessages(convId as number) ? 1 : 0;

      return {
        displayName,
        displayUsername,
        displayAvatar,
        isVerified,
        isTyping,
        lastMessageText,
        timestamp,
        unseenCount,
      };
    },
    [typingUsers, formatTimestamp, currentUserId, hasUnseenMessages]
  );

  return {
    // State
    loading,
    error,
    conversations,
    showNewConvoModal,
    newUserId,
    creatingConvo,
    unseenConversationsCount: totalUnseenCount, // Use API total unseen count

    // Setters
    setShowNewConvoModal,
    setNewUserId,

    // Handlers
    handleCreateConversation,
    getConversationDisplay,
  };
}
