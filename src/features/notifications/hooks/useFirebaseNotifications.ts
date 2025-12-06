import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Unsubscribe } from 'firebase/firestore';
import { subscribeToNotifications } from '../lib/firebase/firestore';
import { isFirebaseConfigured } from '../lib/firebase/config';
import { FirebaseNotificationEvent, Notification } from '../types';
import { NOTIFICATION_QUERY_KEYS } from '../constants';

interface UseFirebaseNotificationsOptions {
  userId: number | null;
  enabled?: boolean;
  onNewNotification?: (notification: FirebaseNotificationEvent) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook to listen to real-time Firebase notifications
 * Automatically syncs with React Query cache
 */
export const useFirebaseNotifications = ({
  userId,
  enabled = true,
  onNewNotification,
  onError,
}: UseFirebaseNotificationsOptions) => {
  const queryClient = useQueryClient();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const invalidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Debounced invalidation to prevent multiple rapid refetches
   * If multiple notifications arrive within 500ms, only refetch once
   */
  const debouncedInvalidateQueries = useCallback(() => {
    // Clear any pending invalidation
    if (invalidationTimeoutRef.current) {
      clearTimeout(invalidationTimeoutRef.current);
    }

    // Schedule a new invalidation
    invalidationTimeoutRef.current = setTimeout(async () => {
      try {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: NOTIFICATION_QUERY_KEYS.ALL,
          }),
          queryClient.invalidateQueries({
            queryKey: NOTIFICATION_QUERY_KEYS.UNREAD_COUNT,
          }),
        ]);
      } catch (error) {
        console.error('❌ Error invalidating queries:', error);
      }
    }, 500); // 500ms debounce
  }, [queryClient]);

  /**
   * Handler for new notifications from Firebase
   */
  const handleNewNotification = useCallback(
    async (event: FirebaseNotificationEvent) => {
      // Call custom callback if provided
      onNewNotification?.(event);

      // Use debounced invalidation to prevent multiple rapid refetches
      debouncedInvalidateQueries();
    },
    [onNewNotification, debouncedInvalidateQueries]
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
      // Clear any pending debounced invalidation
      if (invalidationTimeoutRef.current) {
        clearTimeout(invalidationTimeoutRef.current);
        invalidationTimeoutRef.current = null;
      }
    };
  }, [userId, enabled, handleNewNotification, handleError]);

  return {
    isSubscribed: !!unsubscribeRef.current,
  };
};

/**
 * Hook to fetch a specific notification by ID
 * Useful after receiving a Firebase event
 */
export const useFetchNotification = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (notificationId: string): Promise<Notification | null> => {
      try {
        // In a real implementation, you'd have an API endpoint for this
        // For now, we'll refetch the list and find the notification
        await queryClient.invalidateQueries({
          queryKey: NOTIFICATION_QUERY_KEYS.ALL,
        });

        // Suppress unused variable warning - kept for API compatibility
        void notificationId;
        return null; // Would return the fetched notification
      } catch (error) {
        console.error('❌ Error fetching notification:', error);
        return null;
      }
    },
    [queryClient]
  );
};
