import {
  collection,
  onSnapshot,
  Unsubscribe,
  DocumentChange,
} from 'firebase/firestore';
import { getFirestoreInstance } from './config';
import { FirebaseNotificationEvent } from '../../types';

/**
 * Subscribe to real-time notifications for a user
 * Returns an unsubscribe function to stop listening
 */
export const subscribeToNotifications = (
  userId: number,
  onNewNotification: (notification: FirebaseNotificationEvent) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const db = getFirestoreInstance();
    const notificationsRef = collection(db, `users/${userId}/notifications`);

    // Track if this is the first snapshot (initial load)
    let isFirstSnapshot = true;

    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        // Skip the initial snapshot to avoid treating existing notifications as new
        if (isFirstSnapshot) {
          isFirstSnapshot = false;
          return;
        }

        // Only process actual new notifications after the initial load
        snapshot.docChanges().forEach((change: DocumentChange) => {
          if (change.type === 'added') {
            const data = change.doc.data() as FirebaseNotificationEvent;
            onNewNotification(data);
          }
        });
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        onError?.(error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
};
