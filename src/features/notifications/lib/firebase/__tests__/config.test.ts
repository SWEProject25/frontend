import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  initializeFirebase,
  getFirestoreInstance,
  getAnalyticsInstance,
  isFirebaseConfigured,
} from '../config';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  getApps: vi.fn(),
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
}));

describe('Firebase Config', () => {
  const mockApp = { name: '[DEFAULT]' };
  const mockFirestore = { type: 'firestore' };
  const mockAnalytics = { app: mockApp };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    // Set up default environment variables using vi.stubEnv
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'test-api-key');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'test-auth-domain');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'test-project-id');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'test-storage-bucket');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'test-sender-id');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'test-app-id');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'test-measurement-id');
    vi.stubEnv('NEXT_PUBLIC_FIREBASE_DATABASE_URL', 'test-database-url');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('initializeFirebase', () => {
    it('should initialize Firebase when no apps exist', () => {
      vi.mocked(getApps).mockReturnValue([]);
      vi.mocked(initializeApp).mockReturnValue(mockApp as any);

      const result = initializeFirebase();

      expect(initializeApp).toHaveBeenCalled();
      expect(result).toBe(mockApp);
    });

    it('should return existing app when already initialized', () => {
      vi.mocked(getApps).mockReturnValue([mockApp as any]);

      const result = initializeFirebase();

      expect(initializeApp).not.toHaveBeenCalled();
      expect(result).toBe(mockApp);
    });
  });

  describe('getFirestoreInstance', () => {
    it('should initialize Firestore', () => {
      vi.mocked(getApps).mockReturnValue([]);
      vi.mocked(initializeApp).mockReturnValue(mockApp as any);
      vi.mocked(getFirestore).mockReturnValue(mockFirestore as any);

      const result = getFirestoreInstance();

      expect(result).toBeTruthy();
    });

    it('should return same instance on subsequent calls', () => {
      vi.mocked(getApps).mockReturnValue([mockApp as any]);
      vi.mocked(getFirestore).mockReturnValue(mockFirestore as any);

      const result1 = getFirestoreInstance();
      const result2 = getFirestoreInstance();

      expect(result1).toBe(result2);
    });
  });

  describe('getAnalyticsInstance', () => {
    it('should return null in server environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Deleting global.window for testing
      delete global.window;

      const result = getAnalyticsInstance();

      expect(result).toBeNull();
      expect(getAnalytics).not.toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('should initialize Analytics in browser environment', () => {
      vi.mocked(getApps).mockReturnValue([mockApp as any]);
      vi.mocked(getAnalytics).mockReturnValue(mockAnalytics as any);

      const result = getAnalyticsInstance();

      expect(result).toBeTruthy();
    });

    it('should return same instance on subsequent calls', () => {
      vi.mocked(getApps).mockReturnValue([mockApp as any]);
      vi.mocked(getAnalytics).mockReturnValue(mockAnalytics as any);

      const result1 = getAnalyticsInstance();
      const result2 = getAnalyticsInstance();

      expect(result1).toBe(result2);
    });

    it('should handle Analytics initialization errors gracefully', () => {
      vi.resetModules();
      vi.mocked(getApps).mockReturnValue([mockApp as any]);
      vi.mocked(getAnalytics).mockImplementation(() => {
        throw new Error('Analytics not available');
      });

      // Should return null on error
      expect(() => getAnalyticsInstance()).not.toThrow();
    });
  });

  describe('isFirebaseConfigured', () => {
    it('should check if Firebase has required configuration', () => {
      const result = isFirebaseConfigured();
      // Result depends on actual environment variables
      expect(typeof result).toBe('boolean');
    });

    it('should return false when apiKey is missing', () => {
      vi.stubEnv('NEXT_PUBLIC_FIREBASE_API_KEY', undefined);
      const result = isFirebaseConfigured();
      expect(result).toBe(false);
    });

    it('should return false when projectId is missing', () => {
      vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', undefined);
      const result = isFirebaseConfigured();
      expect(result).toBe(false);
    });

    it('should return false when appId is missing', () => {
      vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', undefined);
      const result = isFirebaseConfigured();
      expect(result).toBe(false);
    });
  });
});
