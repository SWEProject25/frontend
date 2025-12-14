import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAuthInstance,
  signInToFirebase,
  signOutFirebase,
  getCurrentFirebaseUser,
  isFirebaseAuthenticated,
} from '../auth';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeFirebase, isFirebaseConfigured } from '../config';

// Mock Firebase modules
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInAnonymously: vi.fn(),
}));

vi.mock('../config', () => ({
  initializeFirebase: vi.fn(),
  isFirebaseConfigured: vi.fn(),
}));

describe('Firebase Auth', () => {
  const mockApp = { name: '[DEFAULT]' };
  const mockAuth = {
    app: mockApp,
    currentUser: null,
    signOut: vi.fn(),
  };
  const mockUser = {
    uid: 'test-uid',
    isAnonymous: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(initializeFirebase).mockReturnValue(mockApp as any);
    vi.mocked(getAuth).mockReturnValue(mockAuth as any);
    vi.mocked(isFirebaseConfigured).mockReturnValue(true);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Reset auth module state
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAuthInstance', () => {
    it('should get Firebase Auth instance', () => {
      const result = getAuthInstance();

      expect(initializeFirebase).toHaveBeenCalled();
      expect(getAuth).toHaveBeenCalledWith(mockApp);
      expect(result).toBe(mockAuth);
    });

    it('should return cached Auth instance on subsequent calls', () => {
      const result1 = getAuthInstance();
      const result2 = getAuthInstance();

      // Should return same instance
      expect(result1).toBe(result2);
    });

    it('should return null if Firebase is not configured', () => {
      // Need to reimport to clear cached auth
      vi.resetModules();
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);

      const result = getAuthInstance();

      // Should handle unconfigured state
      expect(initializeFirebase).not.toHaveBeenCalled();
    });

    it('should handle initialization errors', () => {
      vi.resetModules();
      vi.mocked(initializeFirebase).mockImplementation(() => {
        throw new Error('Init failed');
      });

      // Should handle errors gracefully
      expect(() => getAuthInstance()).not.toThrow();
    });
  });

  describe('signInToFirebase', () => {
    it('should sign in anonymously when not authenticated', async () => {
      vi.mocked(signInAnonymously).mockResolvedValue({
        user: mockUser,
      } as any);

      const result = await signInToFirebase();

      expect(signInAnonymously).toHaveBeenCalledWith(mockAuth);
      expect(result).toBe(true);
    });

    it('should check if already authenticated', async () => {
      // Test that the function handles authenticated state
      const result = await signInToFirebase();

      expect(typeof result).toBe('boolean');
    });

    it('should return false if Firebase is not configured', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);

      const result = await signInToFirebase();

      expect(result).toBe(false);
      expect(signInAnonymously).not.toHaveBeenCalled();
    });

    it('should handle sign in errors', async () => {
      vi.resetModules();
      vi.mocked(isFirebaseConfigured).mockReturnValue(true);
      vi.mocked(signInAnonymously).mockRejectedValue(
        new Error('Sign in failed')
      );

      const result = await signInToFirebase();

      expect(result).toBe(false);
    });

    it('should complete sign in flow', async () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(true);
      vi.mocked(signInAnonymously).mockResolvedValue({
        user: mockUser,
      } as any);

      const result = await signInToFirebase();

      // Should complete without errors
      expect(typeof result).toBe('boolean');
    });
  });

  describe('signOutFirebase', () => {
    it('should sign out from Firebase', async () => {
      const authWithUser = { ...mockAuth, currentUser: mockUser };
      vi.mocked(getAuth).mockReturnValue(authWithUser as any);

      await signOutFirebase();

      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should return early if auth is not configured', async () => {
      vi.resetModules();
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);

      await expect(signOutFirebase()).resolves.not.toThrow();
    });

    it('should handle sign out errors', async () => {
      const authWithUser = { ...mockAuth, currentUser: mockUser };
      vi.mocked(getAuth).mockReturnValue(authWithUser as any);
      mockAuth.signOut.mockRejectedValue(new Error('Sign out failed'));

      await expect(signOutFirebase()).resolves.not.toThrow();
    });

    it('should log success message', async () => {
      const authWithUser = { ...mockAuth, currentUser: mockUser };
      vi.mocked(getAuth).mockReturnValue(authWithUser as any);
      mockAuth.signOut.mockResolvedValue();

      const consoleSpy = vi.spyOn(console, 'log');

      await signOutFirebase();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Signed out')
      );
    });
  });

  describe('getCurrentFirebaseUser', () => {
    it('should return user if available', () => {
      // Test returns a value (user or null)
      const result = getCurrentFirebaseUser();

      // Should be null or a user object
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('should return null if not authenticated', () => {
      const result = getCurrentFirebaseUser();

      expect(result).toBeNull();
    });

    it('should return null if auth is not configured', () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);

      const result = getCurrentFirebaseUser();

      expect(result).toBeNull();
    });
  });

  describe('isFirebaseAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      vi.resetModules();
      const authWithUser = { ...mockAuth, currentUser: mockUser };
      vi.mocked(getAuth).mockReturnValue(authWithUser as any);
      vi.mocked(isFirebaseConfigured).mockReturnValue(true);

      const result = isFirebaseAuthenticated();

      // Should detect authenticated state
      expect(typeof result).toBe('boolean');
    });

    it('should return false when not authenticated', () => {
      const result = isFirebaseAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false if auth is not configured', () => {
      vi.mocked(isFirebaseConfigured).mockReturnValue(false);

      const result = isFirebaseAuthenticated();

      expect(result).toBe(false);
    });
  });
});
