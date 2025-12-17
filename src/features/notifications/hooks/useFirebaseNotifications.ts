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
      console.log('\n🔥 ═══════════════════════════════════════════════════');
      console.log('🔔 New Firebase Notification Received!');
      console.log('═══════════════════════════════════════════════════');
      console.log('📋 Notification Details:');
      console.log('   ID:', event.id);
      console.log('   Type:', event.type);
      console.log('   Recipient ID:', event.recipientId);
      console.log(
        '   Actor:',
        event.actor.displayName,
        `(@${event.actor.username})`
      );
      console.log('   Actor ID:', event.actor.id);
      console.log('   Created At:', event.createdAt);
      console.log('   Is Read:', event.isRead);

      // Log type-specific fields
      if (event.postId) {
        console.log('   Post ID:', event.postId);
      }
      if (event.postPreviewText) {
        console.log(
          '   Post Preview:',
          event.postPreviewText.substring(0, 50) + '...'
        );
      }
      if (event.replyId) {
        console.log('   Reply ID:', event.replyId);
        console.log('   Thread Post ID:', event.threadPostId);
      }
      if (event.quotePostId) {
        console.log('   Quote Post ID:', event.quotePostId);
      }
      if (event.post) {
        console.log('   Post Data:', {
          postId: event.post.postId,
          text: event.post.text?.substring(0, 50) + '...',
          isQuote: event.post.isQuote,
          hasOriginalData: !!event.post.originalPostData,
        });
      }
      if (event.conversationId || event.messageId) {
        console.log('   Conversation ID:', event.conversationId);
        console.log('   Message ID:', event.messageId);
      }

      console.log('   Full Event:', JSON.stringify(event, null, 2));
      console.log('═══════════════════════════════════════════════════\n');

      // Call custom callback if provided
      if (onNewNotification) {
        console.log('📞 Calling custom notification handler...');
        onNewNotification?.(event);
      }

      // Handle DM notifications specially - only invalidate message queries
      if (event.type === 'DM') {
        queryClient.invalidateQueries({
          queryKey: ['messages', 'conversations'],
        });
        // Invalidate total unseen message count
        queryClient.invalidateQueries({
          queryKey: ['messages', 'unseen', 'total'],
        });
        return; // Skip adding to notification list and incrementing notification count
      }
      // 1. Add the new notification to the list cache optimistically (non-DM only)
      console.log('📥 Adding notification to cache...');
      queryClient.setQueriesData<any>(
        { queryKey: ['notifications', 'list'] },
        (oldData: any) => {
          if (!oldData) {
            console.log('   ⚠️  No existing notification data in cache');
            return oldData;
          }

          console.log(
            '   ✅ Found existing notification data, prepending new notification'
          );

          // Add the new notification to the first page
          return {
            ...oldData,
            pages: oldData.pages.map((page: any, index: number) => {
              if (index === 0) {
                // Add to the first page
                return {
                  ...page,
                  data: [event, ...page.data],
                  metadata: {
                    ...page.metadata,
                    totalItems: page.metadata.totalItems + 1,
                  },
                };
              }
              return page;
            }),
          };
        }
      );

      // 2. Optimistically increment the count (non-DM only)
      console.log('📈 Updating unread count optimistically...');
      optimisticallyIncrementCount(event.type);

      console.log(
        '✨ Notification processing complete - UI should update immediately!\n'
      );
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
    console.log('🔧 useFirebaseNotifications: Effect triggered', {
      enabled,
      userId,
      hasUnsubscribe: !!unsubscribeRef.current,
    });

    // Don't subscribe if disabled or no user
    if (!enabled || !userId) {
      console.log('⏸️  Firebase notifications disabled:', {
        enabled,
        userId,
      });
      return;
    }

    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.warn(
        '⚠️ Firebase is not properly configured. Check your environment variables.'
      );
      return;
    }

    console.log('🚀 Attempting to subscribe to Firebase notifications...');

    // Subscribe to notifications
    try {
      unsubscribeRef.current = subscribeToNotifications(
        userId,
        handleNewNotification,
        handleError
      );
      console.log('✅ Firebase subscription setup complete');
    } catch (error) {
      console.error('❌ Error subscribing to notifications:', error);
      handleError(error instanceof Error ? error : new Error('Unknown error'));
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        console.log('🧹 Cleaning up Firebase subscription');
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, enabled, handleNewNotification, handleError]);

  return {
    isSubscribed: !!unsubscribeRef.current,
  };
};
