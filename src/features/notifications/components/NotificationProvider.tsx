'use client';

import React from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { useFirebaseNotifications, useFirebaseAuth } from '../hooks';
import { FirebaseNotificationEvent } from '../types';
import { NOTIFICATION_QUERY_KEYS } from '../constants';

interface NotificationProviderProps {
  children?: React.ReactNode;
}

/**
 * Notification Provider
 * Manages real-time Firestore notification subscriptions
 * Integrates with React Query for cache updates
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  // Sync Firebase Authentication with backend auth
  useFirebaseAuth();

  /**
   * Handle new notification from Firestore
   */
  const handleNewNotification = (event: FirebaseNotificationEvent) => {
    // Play notification sound
    playNotificationSound();

    // Invalidate queries to refresh notifications
    queryClient.invalidateQueries({
      queryKey: NOTIFICATION_QUERY_KEYS.ALL,
    });
  };

  /**
   * Handle Firebase errors
   */
  const handleFirebaseError = (error: Error) => {
    console.error('🔴 Firebase notification error:', error);
  };

  /**
   * Subscribe to Firestore real-time notifications
   */
  useFirebaseNotifications({
    userId,
    enabled: !!userId,
    onNewNotification: handleNewNotification,
    onError: handleFirebaseError,
  });

  return <>{children}</>;
};

/**
 * Play notification sound
 */
function playNotificationSound() {
  if (typeof window !== 'undefined' && 'Audio' in window) {
    try {
      const assetsBaseUrl = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;
      const soundUrl = assetsBaseUrl
        ? `${assetsBaseUrl}/notification.mp3`
        : '/sounds/notification.mp3'; // Fallback to local file

      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch((err) => {
        // Ignore errors from autoplay restrictions
        console.debug('Could not play notification sound:', err);
      });
    } catch {
      console.debug('Notification sound not available');
    }
  }
}

export default NotificationProvider;
