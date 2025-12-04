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
      console.log('✅ Already signed in to Firebase:', auth.currentUser.uid);
      return;
    }

    // Sign in anonymously - no backend needed!
    const userCredential = await signInAnonymously(auth);
    console.log(
      '✅ Firebase Auth: Signed in anonymously',
      userCredential.user.uid
    );
  } catch (error) {
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
    console.log('✅ Firebase Auth: Signed out');
  } catch (error) {
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
