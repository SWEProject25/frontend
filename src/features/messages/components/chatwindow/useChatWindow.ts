import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMessages } from '../../hooks/useMessages';
import { useConversationDetails } from '../../hooks/useConversationDetails';
import { useMessageStore } from '../../store/useMessageStore';
import { useAuthStore } from '../../../authentication/store/authStore';
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

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as any)?.id ?? null;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Socket handlers
  const {
    createMessage,
    joinConversation,
    sendTyping,
    updateMessage,
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
    console.log('👤 Authentication Status:', {
      isAuthenticated,
      userId: currentUserId,
      username: (user as any)?.username,
    });

    if (!isAuthenticated || !currentUserId) {
      console.warn('⚠️ Not properly authenticated! You may need to log in.');
    }
  }, [isAuthenticated, currentUserId, user]);

  // Memoized values
  const messages = useMemo(() => {
    if (!conversationId) return [];
    const msgs = allMessages[Number(conversationId)] || [];
    console.log('🔄 ChatWindow messages updated:', {
      conversationId,
      messageCount: msgs.length,
      seenCount: msgs.filter((m) => m.isSeen).length,
      messages: msgs.map((m) => ({
        id: m.id,
        text: m.text.substring(0, 20),
        isSeen: m.isSeen,
      })),
    });
    return msgs;
  }, [conversationId, allMessages]);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === Number(conversationId)),
    [conversations, conversationId]
  );

  const conversationDetails = useConversationDetails(conversation);

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

    const loadMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const numId = Number(conversationId);
        setActiveConversation(numId);

        // Join the conversation via socket FIRST
        joinConversation(numId, (resp) => {
          if (resp?.status !== 'success') {
            console.error('Failed to join conversation:', resp);
            return;
          }

          console.log('✅ Successfully joined conversation:', numId);

          // NOW mark messages as seen (must be done AFTER joining the room)
          if (currentUserId) {
            console.log('👁️ Marking messages as seen for conversation:', numId);
            markSeen(numId, currentUserId, (seenResp) => {
              if (seenResp?.status === 'success') {
                console.log('✅ Messages marked as seen successfully');
              } else {
                console.warn('⚠️ Failed to mark messages as seen:', seenResp);
              }
            });
          }
        });

        // Try to fetch existing messages
        try {
          console.log(
            '📥 Attempting to fetch messages for conversation:',
            numId
          );
          const response = await fetchMessages(numId);
          console.log('✅ Messages fetched successfully:', response);

          // Backend returns: { messages: [...], metadata: {...} }
          if (response?.messages) {
            setMessagesForConversation(numId, response.messages);
            console.log('📊 Metadata:', response.metadata);
          }
        } catch (fetchError: any) {
          console.warn('⚠️ Could not fetch messages:', fetchError.message);
          console.log(
            '💡 This is expected if backend GET /messages endpoint is not ready yet'
          );
          setMessagesForConversation(numId, []);
        }
      } catch (err) {
        console.error('❌ Error loading conversation:', err);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
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
        console.log(
          `🗑️ Deleting message ${messageId} from conversation ${conversationId}`
        );
        await deleteMessageApi(Number(conversationId), messageId);
        deleteMessageFromStore(Number(conversationId), messageId);
        console.log('✅ Message deleted successfully');
      } catch (error: any) {
        console.error('❌ Failed to delete message:', error.message);
        setError('Failed to delete message. Please try again.');
        setTimeout(() => setError(null), 3000);
      }
    },
    [conversationId, deleteMessageFromStore]
  );

  const handleEditMessage = useCallback(
    (messageId: number, newText: string) => {
      if (!conversationId || !currentUserId) return;

      if (newText.length > 1000) {
        setError('Message is too long (max 1000 characters)');
        setTimeout(() => setError(null), 3000);
        return;
      }

      console.log(`✏️ Editing message ${messageId}`);
      updateMessage(
        {
          id: messageId,
          senderId: currentUserId,
          text: newText,
        },
        (response) => {
          if (response.status === 'success') {
            console.log('✅ Message edited successfully');
          } else {
            console.error('❌ Failed to edit message:', response);
            setError('Failed to edit message. Please try again.');
            setTimeout(() => setError(null), 3000);
          }
        }
      );
    },
    [conversationId, currentUserId, updateMessage]
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

    // Handlers
    handleSendMessage,
    handleKeyPress,
    handleTyping,
    handleDeleteMessage,
    handleEditMessage,
    isMyMessage,
  };
}
