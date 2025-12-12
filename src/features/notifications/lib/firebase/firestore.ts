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

    console.log('🔥 Firebase: Subscribing to notifications for user:', userId);

    // Track if this is the first snapshot (initial load)
    let isFirstSnapshot = true;

    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        console.log(
          `📡 Firebase: Snapshot received (Size: ${snapshot.size}, IsFirst: ${isFirstSnapshot})`
        );

        // Skip the initial snapshot to avoid treating existing notifications as new
        if (isFirstSnapshot) {
          isFirstSnapshot = false;
          console.log('⏭️  Firebase: Skipping initial snapshot');
          return;
        }

        // Log all document changes
        const changes = snapshot.docChanges();
        console.log(
          `📦 Firebase: ${changes.length} document change(s) detected`
        );

        // Only process actual new notifications after the initial load
        changes.forEach((change: DocumentChange, index: number) => {
          const changeType = change.type;
          const docData = change.doc.data();

          console.log(`\n🔔 Firebase Event #${index + 1}:`);
          console.log(`   Type: ${changeType}`);
          console.log(`   Doc ID: ${change.doc.id}`);
          console.log(`   Data:`, JSON.stringify(docData, null, 2));

          if (changeType === 'added') {
            const data = docData as FirebaseNotificationEvent;
            console.log(
              `✅ Firebase: Processing new notification (Type: ${data.type})`
            );
            onNewNotification(data);
          } else if (changeType === 'modified') {
            console.log(`📝 Firebase: Document modified (skipped)`);
          } else if (changeType === 'removed') {
            console.log(`🗑️  Firebase: Document removed (skipped)`);
          }
        });

        console.log(`─────────────────────────────────────\n`);
      },
      (error) => {
        console.error('❌ Firebase: Subscription error:', error);
        console.error('   Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack,
        });
        onError?.(error);
      }
    );

    console.log('✅ Firebase: Subscription established successfully');
    return unsubscribe;
  } catch (error) {
    console.error('❌ Firebase: Error subscribing to notifications:', error);
    throw error;
  }
};
