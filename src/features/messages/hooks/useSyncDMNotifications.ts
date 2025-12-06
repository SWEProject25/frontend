import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUnreadCount } from '@/features/notifications/hooks';
import { useMessageStore } from '../store/useMessageStore';
import { fetchConversations } from '../api/messages';

/**
 * Hook to sync DM notifications with the messages system
 * Refetches conversations when DM notification count changes
 * This ensures messages show up even when WebSocket is not working
 */
export const useSyncDMNotifications = () => {
  const queryClient = useQueryClient();
  const previousCountRef = useRef<number | null>(null);
  const setConversations = useMessageStore((s) => s.setConversations);
  const addMessage = useMessageStore((s) => s.addMessage);

  // Monitor DM notification count
  const { data: dmNotificationCount = 0 } = useUnreadCount({
    include: 'DM',
  });

  const syncConversations = useCallback(async () => {
    try {
      const conversations = await fetchConversations();
      console.log(
        '✅ Conversations synced from DM notifications:',
        conversations.length
      );

      // Update conversations in store
      setConversations(conversations);

      // Extract lastMessage from each conversation and add to message store
      // This ensures the message preview and unseen status work correctly
      conversations.forEach((conv: any) => {
        if (conv.lastMessage) {
          const conversationId = conv.conversationId || conv.id;
          const lastMsg = conv.lastMessage;
          console.log(
            `📥 Syncing lastMessage for conversation ${conversationId}:`,
            {
              messageId: lastMsg.id,
              senderId: lastMsg.senderId,
              isSeen: lastMsg.isSeen,
              text: lastMsg.text?.substring(0, 30),
            }
          );

          // Add the last message to the message store if it doesn't exist
          addMessage(conv.lastMessage);
        }
      });

      // Invalidate message queries to ensure UI updates
      queryClient.invalidateQueries({
        queryKey: ['messages', 'conversations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages', 'unseen-count'],
      });
    } catch (error) {
      console.error('❌ Failed to sync conversations:', error);
    }
  }, [setConversations, addMessage, queryClient]);

  useEffect(() => {
    // On first render, sync immediately if there are DM notifications
    if (previousCountRef.current === null) {
      previousCountRef.current = dmNotificationCount;

      if (dmNotificationCount > 0) {
        console.log('📬 Initial sync: DM notifications detected on mount', {
          count: dmNotificationCount,
        });
        syncConversations();
      }
      return;
    }

    // Check if DM count increased (new message received)
    const countIncreased = dmNotificationCount > previousCountRef.current;

    if (countIncreased) {
      console.log('📬 New DM notification detected! Syncing with messages...', {
        previous: previousCountRef.current,
        current: dmNotificationCount,
      });
      syncConversations();
    }

    // Update previous count
    previousCountRef.current = dmNotificationCount;
  }, [dmNotificationCount, syncConversations]);
};
