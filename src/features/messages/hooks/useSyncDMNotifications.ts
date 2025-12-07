import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFirebaseNotifications } from '@/features/notifications/hooks/useFirebaseNotifications';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { useMessageStore } from '../store/useMessageStore';
import { fetchConversations } from '../api/messages';

/**
 * Syncs conversations when DM notifications arrive via Firebase
 * This keeps the messages module working independently while still responding to notifications
 * Only uses the Conversations API to get accurate unseen counts
 */
export const useSyncDMNotifications = () => {
  const queryClient = useQueryClient();
  const setConversations = useMessageStore((s) => s.setConversations);
  const addMessage = useMessageStore((s) => s.addMessage);
  const updateConversationUnseenCount = useMessageStore(
    (s) => s.updateConversationUnseenCount
  );

  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const syncConversations = useCallback(async () => {
    try {
      console.log('🔄 Syncing conversations due to DM notification...');
      const conversations = await fetchConversations();

      console.log('📦 Fetched conversations:', conversations.length);

      if (!Array.isArray(conversations) || conversations.length === 0) {
        console.warn('⚠️ No conversations returned from API');
        return;
      }

      // Process conversations to ensure all data is properly set
      const processedConversations = conversations.map((conv: any) => {
        const conversationId = conv.conversationId || conv.id;
        const unseenCount = conv.unseenCount ?? 0;

        // Log the lastMessage for debugging
        if (conv.lastMessage) {
          console.log(`📨 Conversation ${conversationId} lastMessage:`, {
            id: conv.lastMessage.id,
            text: conv.lastMessage.text?.substring(0, 50),
            createdAt: conv.lastMessage.createdAt,
          });

          const messageWithConversationId = {
            id: conv.lastMessage.id,
            senderId: conv.lastMessage.senderId,
            conversationId: conversationId,
            text: conv.lastMessage.text,
            isSeen: conv.lastMessage.isSeen ?? unseenCount === 0,
            createdAt: conv.lastMessage.createdAt,
            updatedAt: conv.lastMessage.updatedAt,
          };

          // Add/update the last message in the store FIRST
          addMessage(messageWithConversationId);
        }

        // Update unseen count in store
        updateConversationUnseenCount(conversationId, unseenCount);

        // Return normalized conversation with explicit lastMessage
        return {
          ...conv,
          id: conversationId,
          conversationId: conversationId,
          lastMessage: conv.lastMessage || null,
          unseenCount: unseenCount,
        };
      });

      // Now set all conversations at once
      console.log('💾 Setting conversations in store...');
      setConversations(processedConversations);

      // Invalidate queries after everything is set
      queryClient.invalidateQueries({
        queryKey: ['messages', 'conversations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages', 'unseen-count'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages', 'unseen', 'total'],
      });

      console.log('✅ Conversations synced successfully');
    } catch (error) {
      console.error('❌ Failed to sync conversations:', error);
    }
  }, [
    setConversations,
    addMessage,
    updateConversationUnseenCount,
    queryClient,
  ]);

  // Listen to Firebase DM notifications and sync when they arrive
  useFirebaseNotifications({
    userId: userId ?? 0,
    enabled: !!userId,
    onNewNotification: (notification) => {
      // Only sync when it's a DM notification
      if (notification.type === 'DM') {
        console.log(
          '📬 DM notification received via Firebase - syncing conversations from API'
        );
        syncConversations();
      }
    },
  });
};
