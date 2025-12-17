import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../store/authStore';
import { mockAuthUser } from '../mocks/mockAuthData';

describe('authStore', () => {
  beforeEach(() => {
    const state = useAuthStore.getState();
    state.clearUser();
    state.setLoading(false);
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.passwordVerifiedAt).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockAuthUser);
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockAuthUser);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearUser', () => {
    it('should clear user and authentication state', () => {
      const { setUser, clearUser } = useAuthStore.getState();
      setUser(mockAuthUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      clearUser();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.passwordVerifiedAt).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
      setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('setPasswordVerified', () => {
    it('should set password verification timestamp when verified', () => {
      const { setPasswordVerified } = useAuthStore.getState();
      const beforeTime = Date.now();
      setPasswordVerified(true);
      const state = useAuthStore.getState();
      expect(state.passwordVerifiedAt).not.toBeNull();
      expect(state.passwordVerifiedAt).toBeGreaterThanOrEqual(beforeTime);
    });

    it('should clear password verification timestamp when not verified', () => {
      const { setPasswordVerified } = useAuthStore.getState();
      setPasswordVerified(true);
      expect(useAuthStore.getState().passwordVerifiedAt).not.toBeNull();
      setPasswordVerified(false);
      expect(useAuthStore.getState().passwordVerifiedAt).toBeNull();
    });
  });

  describe('checkPasswordVerification', () => {
    it('should return false when password was never verified', () => {
      const { checkPasswordVerification } = useAuthStore.getState();
      expect(checkPasswordVerification()).toBe(false);
    });

    it('should return true when password was recently verified', () => {
      const { setPasswordVerified, checkPasswordVerification } =
        useAuthStore.getState();
      setPasswordVerified(true);
      expect(checkPasswordVerification()).toBe(true);
    });

    it('should return false and clear verification when expired', () => {
      const { setPasswordVerified, checkPasswordVerification } =
        useAuthStore.getState();
      setPasswordVerified(true);
      const expiredTime = Date.now() - 31 * 60 * 1000;
      useAuthStore.setState({ passwordVerifiedAt: expiredTime });
      expect(checkPasswordVerification()).toBe(false);
      expect(useAuthStore.getState().passwordVerifiedAt).toBeNull();
    });

    it('should return true when within 30 minute validity period', () => {
      const { setPasswordVerified, checkPasswordVerification } =
        useAuthStore.getState();
      setPasswordVerified(true);
      const validTime = Date.now() - 29 * 60 * 1000;
      useAuthStore.setState({ passwordVerifiedAt: validTime });
      expect(checkPasswordVerification()).toBe(true);
      expect(useAuthStore.getState().passwordVerifiedAt).not.toBeNull();
    });
  });

  describe('integration', () => {
    it('should handle complete auth flow', () => {
      const { setUser, setLoading, clearUser } = useAuthStore.getState();
      setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
      setUser(mockAuthUser);
      const stateAfterLogin = useAuthStore.getState();
      expect(stateAfterLogin.user).toEqual(mockAuthUser);
      expect(stateAfterLogin.isAuthenticated).toBe(true);
      setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
      clearUser();
      const stateAfterLogout = useAuthStore.getState();
      expect(stateAfterLogout.user).toBeNull();
      expect(stateAfterLogout.isAuthenticated).toBe(false);
    });

    it('should clear password verification on clearUser', () => {
      const { setUser, setPasswordVerified, clearUser } =
        useAuthStore.getState();
      setUser(mockAuthUser);
      setPasswordVerified(true);
      expect(useAuthStore.getState().passwordVerifiedAt).not.toBeNull();
      clearUser();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.passwordVerifiedAt).toBeNull();
    });
  });
});
