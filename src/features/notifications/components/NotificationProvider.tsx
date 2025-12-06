'use client';

import React from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { useFirebaseNotifications, useFirebaseAuth } from '../hooks';
import { FirebaseNotificationEvent } from '../types';

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

  // Sync Firebase Authentication with backend auth
  useFirebaseAuth();

  /**
   * Handle new notification from Firestore
   * Uses optimistic updates instead of invalidating queries
   */
  const handleNewNotification = (event: FirebaseNotificationEvent) => {
    // Play notification sound
    playNotificationSound();

    // The optimistic update is now handled in useFirebaseNotifications
    // No need to invalidate queries here - polling will sync later
    console.log('⏰ Counter updated optimistically. Polling will confirm.');
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
