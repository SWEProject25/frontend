import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { initializeFirebase } from './config';

let auth: Auth | null = null;

/**
 * Get Firebase Auth instance
 */
export const getAuthInstance = (): Auth => {
  if (!auth) {
    const app = initializeFirebase();
    auth = getAuth(app);
  }
  return auth;
};

/**
 * Sign in to Firebase anonymously
 * Simple authentication that works without backend
 */
export const signInToFirebase = async (): Promise<void> => {
  try {
    const auth = getAuthInstance();

    // Check if already signed in
    if (auth.currentUser) {
      return;
    }

    // Sign in anonymously - no backend needed!
    const userCredential = await signInAnonymously(auth);
  } catch (error: any) {
    // Handle configuration errors gracefully
    if (
      error?.code === 'auth/configuration-not-found' ||
      error?.code === 'auth/operation-not-allowed' ||
      error?.code === 'auth/invalid-api-key'
    ) {
      console.warn(
        '⚠️ Firebase Auth: Anonymous authentication not configured or disabled. Notifications will not work.',
        error?.code
      );
      return; // Don't throw - allow app to continue
    }
    console.error('❌ Firebase Auth: Sign in failed', error);
    throw error;
  }
};

/**
 * Get current Firebase Auth user
 */
export const getCurrentFirebaseUser = () => {
  const auth = getAuthInstance();
  return auth.currentUser;
};

/**
 * Sign out from Firebase
 */
export const signOutFirebase = async (): Promise<void> => {
  try {
    const auth = getAuthInstance();
    await auth.signOut();
  } catch (error: any) {
    // Gracefully handle auth configuration errors
    if (
      error?.code === 'auth/configuration-not-found' ||
      error?.code === 'auth/operation-not-allowed' ||
      error?.code === 'auth/invalid-api-key'
    ) {
      console.warn('⚠️ Firebase Auth: Configuration error during sign out');
      return; // Don't throw
    }
    console.error('❌ Firebase Auth: Sign out failed', error);
    throw error;
  }
};

/**
 * Check if user is authenticated with Firebase
 */
export const isFirebaseAuthenticated = (): boolean => {
  const auth = getAuthInstance();
  return !!auth.currentUser;
};
