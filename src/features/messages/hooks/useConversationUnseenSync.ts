import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMessageStore } from '../store/useMessageStore';
import { getConversationUnseenCount } from '../api/messages';

/**
 * Hook to sync conversation unseen counts when they change
 * This hook listens for query invalidations and updates the store
 */
export const useConversationUnseenSync = (conversationId: number) => {
  const queryClient = useQueryClient();
  const updateConversationUnseenCount = useMessageStore(
    (s) => s.updateConversationUnseenCount
  );

  useEffect(() => {
    // Set up a listener for when the unseen count query is invalidated
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.type === 'updated' &&
        event.query.queryKey[0] === 'messages' &&
        event.query.queryKey[1] === 'unseen' &&
        event.query.queryKey[2] === conversationId
      ) {
        const queryData = event.query.state.data;
        if (typeof queryData === 'number') {
          updateConversationUnseenCount(conversationId, queryData);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId, queryClient, updateConversationUnseenCount]);

  // Also fetch and update on mount
  useEffect(() => {
    const fetchAndUpdate = async () => {
      try {
        const count = await getConversationUnseenCount(conversationId);
        updateConversationUnseenCount(conversationId, count);
      } catch {
        // Failed to fetch unseen count
      }
    };

    fetchAndUpdate();
  }, [conversationId, updateConversationUnseenCount]);
};
