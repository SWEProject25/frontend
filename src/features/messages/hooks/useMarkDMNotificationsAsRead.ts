import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMarkAsRead } from '@/features/notifications/hooks';
import { useNotifications } from '@/features/notifications/hooks';
import { useMessageStore } from '../store/useMessageStore';
import { markMessagesSeen } from '../api/messages';

/**
 * Hook to mark DM notifications as read for a specific conversation
 * Also syncs with the messages system to mark messages as seen
 * Should be called when a conversation is opened
 *
 * @param conversationId - The ID of the conversation being viewed
 */
export const useMarkDMNotificationsAsRead = (
  conversationId?: string | number
) => {
  const queryClient = useQueryClient();
  const { mutate: markAsRead } = useMarkAsRead();
  const markAllMessagesAsSeen = useMessageStore((s) => s.markAllMessagesAsSeen);

  // Get all DM notifications for this conversation
  const { data: notificationsData } = useNotifications({
    include: 'DM',
    limit: 100, // Get enough to cover recent DMs
  });

  useEffect(() => {
    if (!conversationId || !notificationsData) return;

    const numericConversationId = Number(conversationId);

    // Find all unread DM notifications for this conversation
    const unreadDMNotifications = notificationsData.pages
      .flatMap((page) => page.data)
      .filter(
        (notification) =>
          !notification.isRead &&
          notification.conversationId === numericConversationId
      );

    // Only proceed if there are notifications to mark
    if (unreadDMNotifications.length === 0) return;

    // Mark each unread DM notification as read
    unreadDMNotifications.forEach((notification) => {
      markAsRead(notification.id, {
        onSuccess: () => {
          console.log(`✅ Marked DM notification ${notification.id} as read`);
        },
        onError: (error) => {
          console.error(
            `❌ Failed to mark DM notification ${notification.id} as read:`,
            error
          );
        },
      });
    });

    // Sync with messages system: mark all messages in this conversation as seen
    markMessagesSeen(numericConversationId)
      .then(() => {
        console.log(
          `✅ Marked messages as seen in backend for conversation ${numericConversationId}`
        );
        // Update local message store to reflect that messages are seen
        markAllMessagesAsSeen(numericConversationId);
        console.log(
          `✅ Updated local message store for conversation ${numericConversationId}`
        );
      })
      .catch((error) => {
        console.error(`❌ Failed to mark messages as seen in backend:`, error);
      });

    // Invalidate both notification and message queries
    queryClient.invalidateQueries({
      queryKey: ['notifications', 'unread-count'],
    });
    queryClient.invalidateQueries({
      queryKey: ['messages', 'unseen-count'],
    });
  }, [
    conversationId,
    notificationsData,
    markAsRead,
    markAllMessagesAsSeen,
    queryClient,
  ]);
};
