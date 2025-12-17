import { describe, it, expect } from 'vitest';
import {
  NOTIFICATION_ENDPOINTS,
  NOTIFICATION_QUERY_KEYS,
  NOTIFICATION_DEFAULTS,
  NOTIFICATION_TEMPLATES,
} from '../index';
import { NotificationType } from '../../types';

describe('Notification Constants', () => {
  describe('NOTIFICATION_ENDPOINTS', () => {
    it('should have correct BASE endpoint', () => {
      expect(NOTIFICATION_ENDPOINTS.BASE).toBe('/api/v1.0/notifications');
    });

    it('should have correct UNREAD_COUNT endpoint', () => {
      expect(NOTIFICATION_ENDPOINTS.UNREAD_COUNT).toBe(
        '/api/v1.0/notifications/unread-count'
      );
    });

    it('should have correct MARK_ALL_READ endpoint', () => {
      expect(NOTIFICATION_ENDPOINTS.MARK_ALL_READ).toBe(
        '/api/v1.0/notifications/read-all'
      );
    });

    it('should generate correct MARK_READ endpoint with id', () => {
      const id = '123';
      expect(NOTIFICATION_ENDPOINTS.MARK_READ(id)).toBe(
        `/api/v1.0/notifications/${id}/read`
      );
    });
  });

  describe('NOTIFICATION_QUERY_KEYS', () => {
    it('should have correct ALL key', () => {
      expect(NOTIFICATION_QUERY_KEYS.ALL).toEqual(['notifications']);
    });

    it('should generate correct LIST key without params', () => {
      expect(NOTIFICATION_QUERY_KEYS.LIST()).toEqual([
        'notifications',
        'list',
        undefined,
      ]);
    });

    it('should generate correct LIST key with params', () => {
      const params = { unreadOnly: true, page: 1 };
      expect(NOTIFICATION_QUERY_KEYS.LIST(params)).toEqual([
        'notifications',
        'list',
        params,
      ]);
    });

    it('should have correct UNREAD_COUNT key', () => {
      expect(NOTIFICATION_QUERY_KEYS.UNREAD_COUNT).toEqual([
        'notifications',
        'unread-count',
      ]);
    });

    it('should generate correct DETAIL key', () => {
      const id = '456';
      expect(NOTIFICATION_QUERY_KEYS.DETAIL(id)).toEqual([
        'notifications',
        'detail',
        id,
      ]);
    });
  });

  describe('NOTIFICATION_DEFAULTS', () => {
    it('should have correct PAGE_SIZE', () => {
      expect(NOTIFICATION_DEFAULTS.PAGE_SIZE).toBe(20);
    });

    it('should have correct INITIAL_PAGE', () => {
      expect(NOTIFICATION_DEFAULTS.INITIAL_PAGE).toBe(1);
    });

    it('should have correct POLLING_INTERVAL', () => {
      expect(NOTIFICATION_DEFAULTS.POLLING_INTERVAL).toBe(30000);
    });
  });

  describe('NOTIFICATION_TEMPLATES', () => {
    const actorName = 'John Doe';

    it('should generate correct LIKE template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.LIKE](actorName);
      expect(result).toBe(`${actorName} liked your post`);
    });

    it('should generate correct REPOST template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.REPOST](actorName);
      expect(result).toBe(`${actorName} reposted your post`);
    });

    it('should generate correct QUOTE template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.QUOTE](actorName);
      expect(result).toBe(`${actorName} quoted your post`);
    });

    it('should generate correct REPLY template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.REPLY](actorName);
      expect(result).toBe(`${actorName} replied to your post`);
    });

    it('should generate correct MENTION template', () => {
      const result =
        NOTIFICATION_TEMPLATES[NotificationType.MENTION](actorName);
      expect(result).toBe(`${actorName} mentioned you`);
    });

    it('should generate correct FOLLOW template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.FOLLOW](actorName);
      expect(result).toBe(`${actorName} followed you`);
    });

    it('should generate correct DM template', () => {
      const result = NOTIFICATION_TEMPLATES[NotificationType.DM](actorName);
      expect(result).toBe(`${actorName} sent you a message`);
    });

    it('should handle all notification types', () => {
      const types = Object.values(NotificationType);
      types.forEach((type) => {
        expect(NOTIFICATION_TEMPLATES[type]).toBeDefined();
        expect(typeof NOTIFICATION_TEMPLATES[type]).toBe('function');
        const result = NOTIFICATION_TEMPLATES[type](actorName);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
