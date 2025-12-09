import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { initializeFirebase, isFirebaseConfigured } from './config';

let auth: Auth | null = null;
let authFailed = false; // Track if auth has failed to avoid spam

/**
 * Get Firebase Auth instance
 */
export const getAuthInstance = (): Auth | null => {
  try {
    if (!auth && isFirebaseConfigured()) {
      const app = initializeFirebase();
      auth = getAuth(app);
    }
    return auth;
  } catch (error) {
    console.debug('⚠️ Firebase Auth not available:', error);
    return null;
  }
};

/**
 * Sign in to Firebase anonymously
 * Simple authentication that works without backend
 * Returns true if successful, false if auth not configured
 */
export const signInToFirebase = async (): Promise<boolean> => {
  // Skip if already failed
  if (authFailed) {
    return false;
  }

  try {
    const auth = getAuthInstance();

    // Auth not configured - skip silently
    if (!auth) {
      console.debug('ℹ️ Firebase Auth not configured, skipping authentication');
      authFailed = true;
      return false;
    }

    // Check if already signed in
    if (auth.currentUser) {
      console.log('✅ Already signed in to Firebase:', auth.currentUser.uid);
      return true;
    }

    // Sign in anonymously - no backend needed!
    const userCredential = await signInAnonymously(auth);
    console.log(
      '✅ Firebase Auth: Signed in anonymously',
      userCredential.user.uid
    );
    return true;
  } catch (error: any) {
    // Check if it's a configuration error
    if (
      error?.code === 'auth/configuration-not-found' ||
      error?.code === 'auth/invalid-api-key' ||
      error?.message?.includes('configuration')
    ) {
      console.debug(
        'ℹ️ Firebase Auth not properly configured. Notifications will still work via Firestore.'
      );
      authFailed = true; // Don't try again
      return false;
    }

    // Other errors - log but don't spam
    console.error('❌ Firebase Auth error:', error.code || error.message);
    authFailed = true; // Avoid retrying on errors
    return false;
  }
};

/**
 * Get current Firebase Auth user
 */
export const getCurrentFirebaseUser = () => {
  const auth = getAuthInstance();
  return auth?.currentUser || null;
};

/**
 * Sign out from Firebase
 */
export const signOutFirebase = async (): Promise<void> => {
  try {
    const auth = getAuthInstance();
    if (!auth) return; // Auth not configured
    await auth.signOut();
    console.log('✅ Firebase Auth: Signed out');
  } catch (error) {
    console.debug('Firebase Auth: Sign out failed', error);
  }
};

/**
 * Check if user is authenticated with Firebase
 */
export const isFirebaseAuthenticated = (): boolean => {
  const auth = getAuthInstance();
  return !!auth?.currentUser;
};
