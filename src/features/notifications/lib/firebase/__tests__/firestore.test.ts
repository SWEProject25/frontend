import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscribeToNotifications } from '../firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { getFirestoreInstance } from '../config';
import { NotificationType } from '../../../types';

// Mock Firebase modules
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('../config', () => ({
  getFirestoreInstance: vi.fn(),
}));

describe('Firebase Firestore', () => {
  const mockUserId = 123;
  const mockDb = { type: 'firestore' };
  const mockCollectionRef = { path: 'users/123/notifications' };
  const mockUnsubscribe = vi.fn();

  const mockNotification = {
    type: NotificationType.LIKE,
    actorId: 456,
    actorUsername: 'testuser',
    actorName: 'Test User',
    actorAvatar: 'https://example.com/avatar.jpg',
    postId: 789,
    text: 'Test post',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFirestoreInstance).mockReturnValue(mockDb as any);
    vi.mocked(collection).mockReturnValue(mockCollectionRef as any);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('subscribeToNotifications', () => {
    it('should subscribe to user notifications collection', () => {
      vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);

      const onNewNotification = vi.fn();
      const unsubscribe = subscribeToNotifications(
        mockUserId,
        onNewNotification
      );

      expect(getFirestoreInstance).toHaveBeenCalled();
      expect(collection).toHaveBeenCalledWith(
        mockDb,
        'users/123/notifications'
      );
      expect(onSnapshot).toHaveBeenCalled();
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should skip initial snapshot and not call onNewNotification', () => {
      const onNewNotification = vi.fn();
      let snapshotCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      // Simulate initial snapshot
      const mockSnapshot = {
        size: 5,
        docChanges: () => [
          {
            type: 'added',
            doc: {
              id: 'doc1',
              data: () => mockNotification,
            },
          },
        ],
      };

      snapshotCallback(mockSnapshot);

      expect(onNewNotification).not.toHaveBeenCalled();
    });

    it('should process new notifications after initial snapshot', () => {
      const onNewNotification = vi.fn();
      let snapshotCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      // First snapshot (initial)
      snapshotCallback({
        size: 0,
        docChanges: () => [],
      });

      // Second snapshot (new notification)
      snapshotCallback({
        size: 1,
        docChanges: () => [
          {
            type: 'added',
            doc: {
              id: 'doc1',
              data: () => mockNotification,
            },
          },
        ],
      });

      expect(onNewNotification).toHaveBeenCalledTimes(1);
      expect(onNewNotification).toHaveBeenCalledWith(mockNotification);
    });

    it('should handle multiple document changes', () => {
      const onNewNotification = vi.fn();
      let snapshotCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      // Skip initial snapshot
      snapshotCallback({ size: 0, docChanges: () => [] });

      const notification2 = {
        ...mockNotification,
        type: NotificationType.FOLLOW,
      };

      // Multiple changes
      snapshotCallback({
        size: 2,
        docChanges: () => [
          {
            type: 'added',
            doc: { id: 'doc1', data: () => mockNotification },
          },
          {
            type: 'added',
            doc: { id: 'doc2', data: () => notification2 },
          },
        ],
      });

      expect(onNewNotification).toHaveBeenCalledTimes(2);
      expect(onNewNotification).toHaveBeenNthCalledWith(1, mockNotification);
      expect(onNewNotification).toHaveBeenNthCalledWith(2, notification2);
    });

    it('should ignore modified document changes', () => {
      const onNewNotification = vi.fn();
      let snapshotCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      // Skip initial snapshot
      snapshotCallback({ size: 0, docChanges: () => [] });

      // Modified change
      snapshotCallback({
        size: 1,
        docChanges: () => [
          {
            type: 'modified',
            doc: { id: 'doc1', data: () => mockNotification },
          },
        ],
      });

      expect(onNewNotification).not.toHaveBeenCalled();
    });

    it('should ignore removed document changes', () => {
      const onNewNotification = vi.fn();
      let snapshotCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      // Skip initial snapshot
      snapshotCallback({ size: 0, docChanges: () => [] });

      // Removed change
      snapshotCallback({
        size: 1,
        docChanges: () => [
          {
            type: 'removed',
            doc: { id: 'doc1', data: () => mockNotification },
          },
        ],
      });

      expect(onNewNotification).not.toHaveBeenCalled();
    });

    it('should call error handler on snapshot error', () => {
      const onNewNotification = vi.fn();
      const onError = vi.fn();
      let errorCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback, errorCb) => {
        errorCallback = errorCb;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification, onError);

      const error = new Error('Snapshot error');
      errorCallback(error);

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should not throw if onError is not provided', () => {
      const onNewNotification = vi.fn();
      let errorCallback: any;

      vi.mocked(onSnapshot).mockImplementation((ref, callback, errorCb) => {
        errorCallback = errorCb;
        return mockUnsubscribe;
      });

      subscribeToNotifications(mockUserId, onNewNotification);

      const error = new Error('Snapshot error');

      expect(() => errorCallback(error)).not.toThrow();
    });

    it('should throw error if subscription fails', () => {
      vi.mocked(collection).mockImplementation(() => {
        throw new Error('Collection error');
      });

      expect(() => {
        subscribeToNotifications(mockUserId, vi.fn());
      }).toThrow('Collection error');
    });

    it('should log subscription details', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);

      subscribeToNotifications(mockUserId, vi.fn());

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Subscribing to notifications'),
        mockUserId
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Subscription established successfully')
      );
    });
  });
});
