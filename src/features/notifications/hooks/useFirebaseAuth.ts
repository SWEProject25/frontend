import { useEffect } from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { signInToFirebase, signOutFirebase } from '../lib/firebase/auth';

/**
 * Hook to authenticate with Firebase using anonymous auth
 * Simple approach - no backend token needed
 */
export const useFirebaseAuth = () => {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      // User logged in - sign in to Firebase anonymously
      signInToFirebase().catch((error) => {
        console.error('Failed to sign in to Firebase:', error);
      });
    } else {
      // User logged out - sign out from Firebase
      signOutFirebase().catch(() => {
        // Ignore errors
      });
    }
  }, [user]);
};
