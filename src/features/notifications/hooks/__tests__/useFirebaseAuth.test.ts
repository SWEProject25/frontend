import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFirebaseAuth } from '../useFirebaseAuth';
import { useAuthStore } from '@/features/authentication/store/authStore';
import * as firebaseAuth from '../../lib/firebase/auth';

// Mock the auth store
vi.mock('@/features/authentication/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock Firebase auth functions
vi.mock('../../lib/firebase/auth', () => ({
  signInToFirebase: vi.fn(() => Promise.resolve(true)),
  signOutFirebase: vi.fn(() => Promise.resolve()),
}));

describe('useFirebaseAuth', () => {
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    profile: { name: 'Test User' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should sign in to Firebase when user logs in', async () => {
    const mockSignIn = vi.mocked(firebaseAuth.signInToFirebase);
    mockSignIn.mockResolvedValue(true);

    // Start with no user
    vi.mocked(useAuthStore).mockReturnValue(null);

    const { rerender } = renderHook(() => useFirebaseAuth());

    // User logs in
    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    rerender();

    await waitFor(
      () => {
        expect(mockSignIn).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should sign out from Firebase when user logs out', async () => {
    const mockSignOut = vi.mocked(firebaseAuth.signOutFirebase);
    mockSignOut.mockResolvedValue(undefined);

    // Start with user
    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    const { rerender } = renderHook(() => useFirebaseAuth());

    // User logs out
    vi.mocked(useAuthStore).mockReturnValue(null);

    rerender();

    await waitFor(
      () => {
        expect(mockSignOut).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should not sign in again if already attempted', async () => {
    const mockSignIn = vi.mocked(firebaseAuth.signInToFirebase);
    mockSignIn.mockResolvedValue(true);

    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    const { rerender } = renderHook(() => useFirebaseAuth());

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    // Rerender with same user
    rerender();

    // Should not call signIn again
    expect(mockSignIn).toHaveBeenCalledTimes(1);
  });

  it('should handle sign in errors silently', async () => {
    const mockSignIn = vi.mocked(firebaseAuth.signInToFirebase);
    mockSignIn.mockRejectedValueOnce(new Error('Sign in failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    renderHook(() => useFirebaseAuth());

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    // Should not throw error
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle sign out errors silently', async () => {
    const mockSignOut = vi.mocked(firebaseAuth.signOutFirebase);
    mockSignOut.mockRejectedValue(new Error('Sign out failed'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Start with user
    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    const { rerender } = renderHook(() => useFirebaseAuth());

    // User logs out
    vi.mocked(useAuthStore).mockReturnValue(null);

    rerender();

    await waitFor(
      () => {
        expect(mockSignOut).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );

    // Should not throw error
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should reset attemptedSignIn when user logs out and logs back in', async () => {
    const mockSignIn = vi.mocked(firebaseAuth.signInToFirebase);
    mockSignIn.mockResolvedValue(true);

    const mockSignOut = vi.mocked(firebaseAuth.signOutFirebase);
    mockSignOut.mockResolvedValue();

    // Start with user
    vi.mocked(useAuthStore).mockReturnValue(mockUser);

    const { rerender } = renderHook(() => useFirebaseAuth());

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });

    // User logs out
    vi.mocked(useAuthStore).mockReturnValue(null);
    rerender();

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    // User logs back in
    vi.mocked(useAuthStore).mockReturnValue(mockUser);
    rerender();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(2);
    });
  });
});
