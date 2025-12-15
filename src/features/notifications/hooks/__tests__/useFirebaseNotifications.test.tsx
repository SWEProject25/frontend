import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFirebaseNotifications } from '../useFirebaseNotifications';
import * as firestore from '../../lib/firebase/firestore';
import * as config from '../../lib/firebase/config';
import { ReactNode } from 'react';

// Mock Firebase functions
vi.mock('../../lib/firebase/firestore', () => ({
  subscribeToNotifications: vi.fn(),
}));

vi.mock('../../lib/firebase/config', () => ({
  isFirebaseConfigured: vi.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

describe('useFirebaseNotifications', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'QueryClientWrapper';
    return Wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
    vi.mocked(config.isFirebaseConfigured).mockReturnValue(true);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Subscription Management', () => {
    it('should not subscribe when disabled', () => {
      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: false,
          }),
        { wrapper: createWrapper() }
      );

      expect(firestore.subscribeToNotifications).not.toHaveBeenCalled();
    });

    it('should not subscribe when userId is not provided', () => {
      renderHook(
        () =>
          useFirebaseNotifications({
            userId: null,
            enabled: true,
          }),
        { wrapper: createWrapper() }
      );

      expect(firestore.subscribeToNotifications).not.toHaveBeenCalled();
    });

    it('should subscribe when enabled and userId provided', () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(firestore.subscribeToNotifications).mockReturnValue(
        mockUnsubscribe
      );

      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: true,
          }),
        { wrapper: createWrapper() }
      );

      expect(firestore.subscribeToNotifications).toHaveBeenCalledWith(
        123,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should not subscribe when Firebase is not configured', () => {
      vi.mocked(config.isFirebaseConfigured).mockReturnValue(false);

      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: true,
          }),
        { wrapper: createWrapper() }
      );

      expect(firestore.subscribeToNotifications).not.toHaveBeenCalled();
    });
  });

  describe('Notification Handling', () => {
    it('should subscribe with notification handler', async () => {
      let notificationHandler: any;
      vi.mocked(firestore.subscribeToNotifications).mockImplementation(
        (userId, handler) => {
          notificationHandler = handler;
          return vi.fn();
        }
      );

      const onNewNotification = vi.fn();

      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: true,
            onNewNotification,
          }),
        { wrapper: createWrapper() }
      );

      // Verify subscription was set up
      expect(firestore.subscribeToNotifications).toHaveBeenCalled();
      expect(notificationHandler).toBeDefined();
    });

    it('should setup cache for notifications', async () => {
      vi.mocked(firestore.subscribeToNotifications).mockImplementation(() => {
        return vi.fn();
      });

      // Set up initial cache data
      queryClient.setQueryData(['notifications', 'list'], {
        pages: [
          {
            data: [],
            metadata: { totalItems: 0, currentPage: 1, totalPages: 1 },
          },
        ],
        pageParams: [1],
      });

      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: true,
          }),
        { wrapper: createWrapper() }
      );

      // Verify subscription was set up
      expect(firestore.subscribeToNotifications).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should call onError callback when subscription errors', () => {
      let errorHandler: any;
      vi.mocked(firestore.subscribeToNotifications).mockImplementation(
        (userId, handler, onError) => {
          errorHandler = onError;
          return vi.fn();
        }
      );

      const onError = vi.fn();

      renderHook(
        () =>
          useFirebaseNotifications({
            userId: 123,
            enabled: true,
            onError,
          }),
        { wrapper: createWrapper() }
      );

      const error = new Error('Subscription error');
      errorHandler(error);

      expect(onError).toHaveBeenCalledWith(error);
    });
  });
});
