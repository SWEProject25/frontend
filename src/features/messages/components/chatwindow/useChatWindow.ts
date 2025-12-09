import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useConversationDetails } from '../../hooks/useConversationDetails';
import { useMessageStore } from '../../store/useMessageStore';
import { useAuthStore } from '../../../authentication/store/authStore';
import { useIsUserBlocked } from '../../hooks/useBlockStatus';
import {
  fetchMessages,
  deleteMessage as deleteMessageApi,
} from '../../api/messages';

export function useChatWindow(conversationId?: string) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store selectors
  const conversations = useMessageStore((s) => s.conversations);
  const allMessages = useMessageStore((s) => s.messages);
  const typingUsers = useMessageStore((s) => s.typingUsers);
  const setActiveConversation = useMessageStore((s) => s.setActiveConversation);
  const setMessagesForConversation = useMessageStore(
    (s) => s.setMessagesForConversation
  );
  const deleteMessageFromStore = useMessageStore((s) => s.deleteMessage);
  const markAllMessagesAsSeen = useMessageStore((s) => s.markAllMessagesAsSeen);

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as any)?.id ?? null;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Socket handlers
  const {
    createMessage,
    joinConversation,
    sendTyping,
    markSeen,
    setCurrentUserId,
  } = useMessages(
    useCallback((err: any) => {
      console.error('Socket error:', err);
      setError('Connection error. Please try again.');
    }, [])
  );

  // Set current user ID in the hook
  useEffect(() => {
    if (currentUserId && setCurrentUserId) {
      setCurrentUserId(currentUserId);
    }
  }, [currentUserId, setCurrentUserId]);

  // Debug authentication status
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) {
      console.warn('⚠️ Not properly authenticated! You may need to log in.');
    }
  }, [isAuthenticated, currentUserId, user]);

  // Memoized values
  const messages = useMemo(() => {
    if (!conversationId) return [];
    const msgs = allMessages[Number(conversationId)] || [];
    return msgs;
  }, [conversationId, allMessages]);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === Number(conversationId)),
    [conversations, conversationId]
  );

  const conversationDetails = useConversationDetails(conversation);

  // Get the other user's ID from conversation
  const otherUserId = useMemo(() => {
    if (!conversation || !currentUserId) return undefined;
    // Get the user from conversation.user or participants
    return conversation.user?.id;
  }, [conversation, currentUserId]);

  // Check if the other user is blocked
  const { isBlocked } = useIsUserBlocked(otherUserId);

  // Get typing users for current conversation (exclude current user)
  const otherUsersTyping = useMemo(() => {
    if (!conversationId || !currentUserId) return [];
    const typingInConvo = typingUsers[Number(conversationId)] || [];
    return typingInConvo.filter((userId) => userId !== currentUserId);
  }, [conversationId, currentUserId, typingUsers]);

  const isTyping = otherUsersTyping.length > 0;

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversationId) return;

    const numId = Number(conversationId);
    let cancelled = false; // Flag to prevent race conditions

    // Set active conversation immediately (no async needed)
    setActiveConversation(numId);

    // Fetch fresh messages every time we enter a conversation
    // This ensures we get the correct isSeen and updatedAt values from backend
    const loadMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Join the conversation (fire and continue, don't wait)
        // This tells backend we're viewing it, so it can mark messages as seen
        joinConversation(numId, (resp) => {
          if (resp?.status === 'success') {
          } else {
            console.warn('⚠️ Join conversation response:', resp);
          }
        });

        // Step 2: Small delay to let backend process (but don't block on callback)
        await new Promise((resolve) => setTimeout(resolve, 150));

        if (cancelled) {
          return;
        }

        // Step 3: Now fetch messages - they should have correct isSeen status
        try {
          const response = await fetchMessages(numId);

          if (cancelled) {
            return;
          }

          // Backend returns: { messages: [...], metadata: {...} }
          if (response?.messages) {
            setMessagesForConversation(numId, response.messages);

            // If there are any unseen messages from the other user, mark them as seen
            const unseenMessages = response.messages.filter(
              (msg: any) => !msg.isSeen && msg.senderId !== currentUserId
            );

            if (unseenMessages.length > 0 && currentUserId) {
              markSeen(numId, currentUserId, (resp) => {
                if (resp?.status !== 'success') {
                  console.warn('⚠️ Failed to mark messages as seen:', resp);
                }
              });
            }
          } else {
            setMessagesForConversation(numId, []);
          }
        } catch (fetchError: any) {
          if (cancelled) return;
          console.warn('⚠️ Could not fetch messages:', fetchError.message);
          setMessagesForConversation(numId, []);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('❌ Error loading conversation:', err);
        setError('Failed to load conversation');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    // Cleanup function to prevent race conditions
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Event handlers
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !conversationId || !currentUserId) return;

    const payload = {
      conversationId: Number(conversationId),
      senderId: currentUserId,
      text: message.trim(),
    };

    createMessage(payload, (resp) => {
      if (resp?.status === 'success') {
        setMessage('');
        setError(null);
      } else {
        setError('Failed to send message');
      }
    });
  }, [message, conversationId, currentUserId, createMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleTyping = useCallback(() => {
    if (conversationId) {
      sendTyping(Number(conversationId));
    }
  }, [conversationId, sendTyping]);

  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      if (!conversationId) return;

      try {
        await deleteMessageApi(Number(conversationId), messageId);
        deleteMessageFromStore(Number(conversationId), messageId);
      } catch (error: any) {
        console.error('❌ Failed to delete message:', error.message);
        setError('Failed to delete message. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    },
    [conversationId, deleteMessageFromStore, setError]
  );

  const isMyMessage = useCallback(
    (senderId: number) => {
      if (currentUserId !== null) return senderId === currentUserId;
      const participantIds =
        conversation?.participants?.map((p: any) => p.id) || [];
      return !participantIds.includes(senderId);
    },
    [currentUserId, conversation]
  );

  return {
    // State
    message,
    setMessage,
    loading,
    error,
    messages,
    conversation,
    conversationDetails,
    isTyping,
    currentUserId,
    isAuthenticated,
    isBlocked,

    // Handlers
    handleSendMessage,
    handleKeyPress,
    handleTyping,
    handleDeleteMessage,
    isMyMessage,
  };
}
