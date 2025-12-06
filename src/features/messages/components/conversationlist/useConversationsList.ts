import { useEffect, useState, useCallback, useMemo } from 'react';
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

  const conversationsRaw = useMessageStore((s) => s.conversations);
  const typingUsers = useMessageStore((s) => s.typingUsers);
  const setConversations = useMessageStore((s) => s.setConversations);
  const addMessage = useMessageStore((s) => s.addMessage);

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as { id?: number })?.id ?? null;

  const getUnseenCount = useCallback(
    (conversationId: number): number => {
      const conversation = conversationsRaw.find((conv) => {
        const convId = conv.conversationId || conv.id;
        return convId === conversationId;
      });
      return conversation?.unseenCount ?? 0;
    },
    [conversationsRaw]
  );

  const unseenConversationsCount = useMemo(() => {
    return conversationsRaw.filter((conv) => {
      const convId = conv.conversationId || conv.id;
      return convId ? getUnseenCount(convId) > 0 : false;
    }).length;
  }, [conversationsRaw, getUnseenCount]);

  useEffect(() => {
    if (conversationsRaw.length > 0) return;

    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const conversations = await fetchConversations();

        if (Array.isArray(conversations)) {
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => {
              if (conv.lastMessage) {
                const conversationId = conv.conversationId || conv.id;
                const lastMsg = conv.lastMessage as any;

                const messageWithConversationId = {
                  ...lastMsg,
                  conversationId: conversationId,
                  isSeen: lastMsg.isSeen ?? (conv.unseenCount as number) === 0,
                };

                addMessage(messageWithConversationId);
              }

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
  }, [setConversations, conversationsRaw.length, addMessage]);

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

      const lastMessage = conversation.lastMessage as
        | Record<string, unknown>
        | undefined;
      let lastMessageText = 'No messages yet';

      if (isTyping) {
        lastMessageText = 'typing...';
      } else if (lastMessage?.text) {
        if (currentUserId && lastMessage.senderId === currentUserId) {
          lastMessageText = `You: ${String(lastMessage.text)}`;
        } else {
          lastMessageText = String(lastMessage.text);
        }
      }

      const timestamp = lastMessage?.createdAt
        ? formatTimestamp(lastMessage.createdAt as string)
        : '';

      const unseenCount = getUnseenCount(convId as number);

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
    [typingUsers, formatTimestamp, currentUserId, getUnseenCount]
  );

  return {
    loading,
    error,
    conversations: conversationsRaw,
    showNewConvoModal,
    newUserId,
    creatingConvo,
    unseenConversationsCount,
    setShowNewConvoModal,
    setNewUserId,
    handleCreateConversation,
    getConversationDisplay,
  };
}
