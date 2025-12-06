import { useEffect, useState, useCallback, useMemo } from 'react';
import { useMessageStore } from '../../store/useMessageStore';
import { fetchConversations, createConversation } from '../../api/messages';
import { useAuthStore } from '../../../authentication/store/authStore';
import { useNotifications } from '../../../notifications/hooks';

export function useConversationsList(
  onSelectConversation: (id: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [creatingConvo, setCreatingConvo] = useState(false);

  const conversations = useMessageStore((s) => s.conversations);
  const typingUsers = useMessageStore((s) => s.typingUsers);
  const allMessages = useMessageStore((s) => s.messages);
  const setConversations = useMessageStore((s) => s.setConversations);
  const addMessage = useMessageStore((s) => s.addMessage);

  const user = useAuthStore((s) => s.user);
  const currentUserId = (user as { id?: number })?.id ?? null;

  // Get DM notifications to check which conversations have unread messages
  const { data: dmNotificationsData } = useNotifications({
    include: 'DM',
    limit: 100,
  });

  // Helper to check if a conversation has any unseen messages
  const hasUnseenMessages = useCallback(
    (conversationId: number): boolean => {
      const messages = allMessages[conversationId] || [];

      // Method 1: Check local message store for unseen messages
      const hasUnseenInStore = messages.some(
        (msg) => !msg.isSeen && msg.senderId !== currentUserId
      );

      // Method 2: Check if there are unread DM notifications for this conversation
      const hasUnreadDMNotification =
        dmNotificationsData?.pages
          .flatMap((page) => page.data)
          .some(
            (notification) =>
              !notification.isRead &&
              notification.conversationId === conversationId
          ) || false;

      const hasUnseen = hasUnseenInStore || hasUnreadDMNotification;

      console.log(`📊 Unseen check for conversation ${conversationId}:`, {
        totalMessages: messages.length,
        currentUserId,
        hasUnseenInStore,
        hasUnreadDMNotification,
        hasUnseen,
      });

      return hasUnseen;
    },
    [allMessages, currentUserId, dmNotificationsData]
  );

  // Helper to get the actual count of unseen messages
  const getUnseenCount = useCallback(
    (conversationId: number): number => {
      const messages = allMessages[conversationId] || [];

      // Count unseen messages in local store
      const unseenInStore = messages.filter(
        (msg) => !msg.isSeen && msg.senderId !== currentUserId
      ).length;

      // Count unread DM notifications for this conversation
      const unreadDMNotifications =
        dmNotificationsData?.pages
          .flatMap((page) => page.data)
          .filter(
            (notification) =>
              !notification.isRead &&
              notification.conversationId === conversationId
          ).length || 0;

      // Return the maximum of both counts (prefer store count if available)
      const count = Math.max(unseenInStore, unreadDMNotifications);

      console.log(`🔢 Unread count for conversation ${conversationId}:`, {
        unseenInStore,
        unreadDMNotifications,
        finalCount: count,
      });

      return count;
    },
    [allMessages, currentUserId, dmNotificationsData]
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
      console.log('✅ Using cached conversations, skipping fetch');
      return;
    }

    const loadConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const conversations = await fetchConversations();
        console.log('📥 Fetching conversations from backend:', conversations);

        if (Array.isArray(conversations)) {
          const normalizedConversations = conversations.map(
            (conv: Record<string, unknown>) => {
              console.log('📋 Individual conversation:', conv);

              // Extract lastMessage and add it to the message store
              // This ensures unseen counts and blue dots work correctly
              if (conv.lastMessage) {
                const conversationId = conv.conversationId || conv.id;
                const lastMsg = conv.lastMessage as any;
                console.log(
                  `📥 Adding lastMessage to store for conversation ${conversationId}:`,
                  {
                    messageId: lastMsg.id,
                    senderId: lastMsg.senderId,
                    isSeen: lastMsg.isSeen,
                    text: lastMsg.text?.substring(0, 30),
                    currentUserId,
                  }
                );
                addMessage(lastMsg);
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
  }, [setConversations, conversations.length, addMessage, currentUserId]);

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

      // Get actual count of unseen messages
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
    // State
    loading,
    error,
    conversations,
    showNewConvoModal,
    newUserId,
    creatingConvo,
    unseenConversationsCount,

    // Setters
    setShowNewConvoModal,
    setNewUserId,

    // Handlers
    handleCreateConversation,
    getConversationDisplay,
  };
}
