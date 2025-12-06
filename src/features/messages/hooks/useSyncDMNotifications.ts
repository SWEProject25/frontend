import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUnreadCount } from '@/features/notifications/hooks';
import { useMessageStore } from '../store/useMessageStore';
import { fetchConversations } from '../api/messages';

export const useSyncDMNotifications = () => {
  const queryClient = useQueryClient();
  const previousCountRef = useRef<number | null>(null);
  const setConversations = useMessageStore((s) => s.setConversations);
  const addMessage = useMessageStore((s) => s.addMessage);

  const { data: dmNotificationCount = 0 } = useUnreadCount({
    include: 'DM',
  });

  const syncConversations = useCallback(async () => {
    try {
      const conversations = await fetchConversations();

      const normalizedConversations = conversations.map((conv: any) => ({
        ...conv,
        id: conv.conversationId || conv.id,
      }));

      setConversations(normalizedConversations);

      conversations.forEach((conv: any) => {
        if (conv.lastMessage) {
          const conversationId = conv.conversationId || conv.id;
          const lastMsg = conv.lastMessage;

          const messageWithConversationId = {
            ...lastMsg,
            conversationId: conversationId,
            isSeen: lastMsg.isSeen ?? conv.unseenCount === 0,
          };

          addMessage(messageWithConversationId);

          queryClient.invalidateQueries({
            queryKey: ['messages', 'unseen', conversationId],
          });
        }
      });

      queryClient.invalidateQueries({
        queryKey: ['messages', 'conversations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages', 'unseen-count'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages', 'unseen', 'total'],
      });
    } catch (error) {
      console.error('Failed to sync conversations:', error);
    }
  }, [setConversations, addMessage, queryClient]);

  useEffect(() => {
    if (previousCountRef.current === null) {
      previousCountRef.current = dmNotificationCount;

      if (dmNotificationCount > 0) {
        syncConversations();
      }
      return;
    }

    const countIncreased = dmNotificationCount > previousCountRef.current;

    if (countIncreased) {
      syncConversations();
    }

    previousCountRef.current = dmNotificationCount;
  }, [dmNotificationCount, syncConversations]);
};
