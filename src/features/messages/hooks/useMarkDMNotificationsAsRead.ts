import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMessageStore } from '../store/useMessageStore';
import { markMessagesSeen } from '../api/messages';

/**
 * Hook to mark messages as seen when a conversation is opened
 * Handles the messages module independently from notifications
 * Should be called when a conversation is opened/viewed
 *
 * @param conversationId - The ID of the conversation being viewed
 */
export const useMarkDMNotificationsAsRead = (
  conversationId?: string | number
) => {
  const queryClient = useQueryClient();
  const markAllMessagesAsSeen = useMessageStore((s) => s.markAllMessagesAsSeen);
  const updateConversationUnseenCount = useMessageStore(
    (s) => s.updateConversationUnseenCount
  );

  useEffect(() => {
    if (!conversationId) return;

    const numericConversationId = Number(conversationId);

    // Get current unseen count BEFORE marking as seen (for optimistic update)
    const currentUnseenCount =
      useMessageStore.getState().unseenCounts[numericConversationId] ||
      useMessageStore
        .getState()
        .conversations.find(
          (c) => (c.conversationId || c.id) === numericConversationId
        )?.unseenCount ||
      0;

    // If no unseen messages, nothing to do
    if (currentUnseenCount === 0) {
      return;
    }

    // 1. Update conversation unseen count to 0 immediately
    updateConversationUnseenCount(numericConversationId, 0);

    // 2. Mark messages as seen in local store immediately
    markAllMessagesAsSeen(numericConversationId);

    // 3. Optimistically update the total unseen count in React Query cache
    queryClient.setQueryData(
      ['messages', 'unseen', 'total'],
      (oldCount: number | undefined) => {
        const newCount = Math.max(0, (oldCount || 0) - currentUnseenCount);
        return newCount;
      }
    );

    // 4. Optimistically update per-conversation unseen count
    queryClient.setQueryData(
      ['messages', 'unseen', numericConversationId],
      () => {
        return 0;
      }
    );

    // Now mark messages as seen in the backend
    markMessagesSeen(numericConversationId)
      .then(() => {
        // Invalidate queries to refetch and confirm the optimistic update
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', numericConversationId],
        });
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
      })
      .catch((error) => {
        // On error, invalidate to refetch correct data (rollback optimistic update)
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', numericConversationId],
        });
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
      });
  }, [
    conversationId,
    markAllMessagesAsSeen,
    updateConversationUnseenCount,
    queryClient,
  ]);
};
