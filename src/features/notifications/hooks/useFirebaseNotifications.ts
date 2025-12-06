import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/firestore';
import { subscribeToNotifications } from '../lib/firebase/firestore';
import { isFirebaseConfigured } from '../lib/firebase/config';
import { FirebaseNotificationEvent } from '../types';
import { NOTIFICATION_QUERY_KEYS } from '../constants';

interface UseFirebaseNotificationsOptions {
  userId: number | null;
  enabled?: boolean;
  onNewNotification?: (notification: FirebaseNotificationEvent) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to listen to real-time Firebase notifications
 * Uses optimistic updates to avoid excessive API calls
 */
export const useFirebaseNotifications = ({
  userId,
  enabled = true,
  onNewNotification,
  onError,
}: UseFirebaseNotificationsOptions) => {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  /**
   * Optimistically update unread count in cache
   * The polling system will confirm/correct this value later
   */
  const optimisticallyIncrementCount = useCallback(
    (notificationType: string) => {
      console.log(`📈 Optimistically incrementing ${notificationType} count`);

      // Update the main unread count (all notifications)
      queryClient.setQueryData(
        NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
        (oldCount: number | undefined) => {
          const newCount = (oldCount || 0) + 1;
          console.log(
            `✅ Unread count: ${oldCount || 0} → ${newCount} (optimistic)`
          );
          return newCount;
        }
      );

      // Update filtered counts based on notification type
      if (notificationType === 'DM') {
        // Increment DM count
        queryClient.setQueryData(
          [...NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, { include: 'DM' }],
          (oldCount: number | undefined) => (oldCount || 0) + 1
        );
      } else {
        // Increment non-DM count
        queryClient.setQueryData(
          [...NOTIFICATION_QUERY_KEYS.UNREAD_COUNT, { exclude: 'DM' }],
          (oldCount: number | undefined) => (oldCount || 0) + 1
        );
      }

      console.log(
        '⏰ Polling will confirm this count in the next interval (30s)'
      );
    },
    [queryClient]
  );

  /**
   * Handler for new notifications from Firebase
   */
  const handleNewNotification = useCallback(
    async (event: FirebaseNotificationEvent) => {
      // Call custom callback if provided
      onNewNotification?.(event);

      // Optimistically increment the count immediately
      optimisticallyIncrementCount(event.type);

      // If this is a DM notification, invalidate message-related queries
      // This ensures the messages system syncs when WebSocket is not active
      if (event.type === 'DM') {
        console.log(
          '📬 DM notification received via Firebase - syncing messages'
        );

        // Invalidate DM notification queries to trigger refetch
        queryClient.invalidateQueries({
          queryKey: ['notifications', 'list', { include: 'DM' }],
        });

        // Invalidate message queries to ensure conversations and counts update
        queryClient.invalidateQueries({
          queryKey: ['messages', 'conversations'],
        });

        // Invalidate total unseen message count
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });

        // Note: Per-conversation unseen counts will be invalidated when
        // useSyncDMNotifications runs and fetches the conversations
      }

      // NOTE: We do NOT invalidate the main unread count query here
      // The polling system (refetchInterval in useUnreadCount) will
      // fetch the real count from the server every 30 seconds
    },
    [onNewNotification, optimisticallyIncrementCount, queryClient]
  );

  /**
   * Handler for Firebase errors
   */
  const handleError = useCallback(
    (error: Error) => {
      console.error('❌ Firebase notification error:', error);
      onError?.(error);
    },
    [onError]
  );

  /**
   * Subscribe to Firebase notifications for real-time updates
   */
  useEffect(() => {
    // Don't subscribe if disabled or no user
    if (!enabled || !userId) {
      return;
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.warn(
        '⚠️ Firebase is not properly configured. Check your environment variables.'
      );
      return;
    }

    // Subscribe to notifications
    try {
      unsubscribeRef.current = subscribeToNotifications(
        userId,
        handleNewNotification,
        handleError
      );
    } catch (error) {
      console.error('❌ Error subscribing to notifications:', error);
      handleError(error instanceof Error ? error : new Error('Unknown error'));
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, enabled, handleNewNotification, handleError]);

  return {
    isSubscribed: !!unsubscribeRef.current,
  };
};
