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
  const unseenCounts = useMessageStore((s) => s.unseenCounts);
  const updateConversationUnseenCount = useMessageStore(
    (s) => s.updateConversationUnseenCount
  );

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as { id?: number })?.id ?? null;

  const getUnseenCount = useCallback(
    (conversationId: number): number => {
      // First check the unseenCounts store (most up-to-date from API)
      if (unseenCounts[conversationId] !== undefined) {
        return unseenCounts[conversationId];
      }

      // Fallback to conversation object's unseenCount
      const conversation = conversationsRaw.find((conv) => {
        const convId = conv.conversationId || conv.id;
        return convId === conversationId;
      });
      return conversation?.unseenCount ?? 0;
    },
    [conversationsRaw, unseenCounts]
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
          // First, add all last messages to the message store
          conversations.forEach((conv: Record<string, unknown>) => {
            if (conv.lastMessage) {
              const conversationId = conv.conversationId || conv.id;
              const unseenCount = (conv.unseenCount as number) ?? 0;
              const lastMsg = conv.lastMessage as any;

              const messageWithConversationId = {
                ...lastMsg,
                conversationId: conversationId,
                isSeen: lastMsg.isSeen ?? unseenCount === 0,
              };

              addMessage(messageWithConversationId);
            }
          });

          // Then normalize and set conversations
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => {
              const conversationId = conv.conversationId || conv.id;

              // Update unseen count in store from API
              const unseenCount = (conv.unseenCount as number) ?? 0;
              updateConversationUnseenCount(
                conversationId as number,
                unseenCount
              );

              return {
                ...conv,
                id: conversationId,
                // Ensure lastMessage is preserved
                lastMessage: conv.lastMessage,
              } as any;
            }
          );
          setConversations(normalizedConversations);
        }
      } catch (err) {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [
    setConversations,
    conversationsRaw.length,
    addMessage,
    updateConversationUnseenCount,
  ]);

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

    // Get start of today (midnight)
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    // Check if message is from today
    if (date >= todayStart) {
      // Format time as "3:45 PM"
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    // Check if message is from yesterday
    if (date >= yesterdayStart && date < todayStart) {
      return 'Yesterday';
    }

    // For older messages, show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
