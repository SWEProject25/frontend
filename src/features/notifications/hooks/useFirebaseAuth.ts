import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { signInToFirebase, signOutFirebase } from '../lib/firebase/auth';

/**
 * Hook to authenticate with Firebase using anonymous auth
 * Gracefully handles missing Firebase Auth configuration
 */
export const useFirebaseAuth = () => {
  const user = useAuthStore((s) => s.user);
  const attemptedSignIn = useRef(false);

  useEffect(() => {
    if (user && !attemptedSignIn.current) {
      // User logged in - try to sign in to Firebase anonymously
      attemptedSignIn.current = true;
      signInToFirebase().catch(() => {
        // Silently ignore - already logged in error handler
      });
    } else if (!user) {
      // User logged out - sign out from Firebase
      attemptedSignIn.current = false;
      signOutFirebase().catch(() => {
        // Silently ignore
      });
    }
  }, [user]);
};
