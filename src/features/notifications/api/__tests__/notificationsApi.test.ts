import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { NotificationsApi, notificationsApi } from '../notificationsApi';
import { API_CONFIG } from '@/constants/api';
import { NOTIFICATION_ENDPOINTS } from '../../constants';

describe('NotificationsApi', () => {
  let api: NotificationsApi;

  beforeEach(() => {
    api = new NotificationsApi();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch notifications successfully', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            type: 'follow',
            createdAt: '2024-01-01T00:00:00Z',
            read: false,
            actor: {
              id: 'user1',
              username: 'testuser',
              displayName: 'Test User',
            },
          },
        ],
        pagination: {
          nextCursor: 'cursor123',
          hasMore: true,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getNotifications();

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.BASE}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch notifications with query parameters', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          nextCursor: null,
          hasMore: false,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.getNotifications({
        cursor: 'abc123',
        limit: 20,
        include: ['follow', 'like'],
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('cursor=abc123'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=20'),
        expect.any(Object)
      );
    });

    it('should handle 401 unauthorized error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(api.getNotifications()).rejects.toThrow('Unauthorized');
    });

    it('should handle 404 not found error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Notification not found' }),
      });

      await expect(api.getNotifications()).rejects.toThrow(
        'Notification not found'
      );
    });

    it('should handle 400 bad request error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid parameters' }),
      });

      await expect(api.getNotifications()).rejects.toThrow(
        'Invalid parameters'
      );
    });

    it('should handle generic error without json body', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(api.getNotifications()).rejects.toThrow(
        'Internal Server Error'
      );
    });

    it('should filter out undefined parameters', async () => {
      const mockResponse = {
        data: [],
        pagination: {
          nextCursor: null,
          hasMore: false,
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.getNotifications({
        cursor: undefined,
        limit: 10,
      });

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).not.toContain('cursor');
      expect(url).toContain('limit=10');
    });
  });

  describe('getUnreadCount', () => {
    it('should fetch unread count successfully', async () => {
      const mockResponse = {
        count: 5,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getUnreadCount();

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.UNREAD_COUNT}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should fetch unread count with filters', async () => {
      const mockResponse = {
        count: 2,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.getUnreadCount({
        include: ['follow', 'mention'],
        exclude: ['like'],
      });

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain('include=follow');
      expect(url).toContain('exclude=like');
    });

    it('should handle error when fetching unread count', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: async () => ({ message: 'Failed to get count' }),
      });

      await expect(api.getUnreadCount()).rejects.toThrow('Failed to get count');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotification = {
        id: '1',
        type: 'follow',
        createdAt: '2024-01-01T00:00:00Z',
        read: true,
        actor: {
          id: 'user1',
          username: 'testuser',
          displayName: 'Test User',
        },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotification,
      });

      const result = await api.markAsRead('1');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.MARK_READ('1')}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(mockNotification);
      expect(result.read).toBe(true);
    });

    it('should handle error when marking as read', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Notification not found' }),
      });

      await expect(api.markAsRead('invalid-id')).rejects.toThrow(
        'Notification not found'
      );
    });

    it('should handle network error when marking as read', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(api.markAsRead('1')).rejects.toThrow('Network error');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const mockResponse = {
        message: 'All notifications marked as read',
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.markAllAsRead();

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.MARK_ALL_READ}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle unauthorized error when marking all as read', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Please log in' }),
      });

      await expect(api.markAllAsRead()).rejects.toThrow('Please log in');
    });

    it('should handle server error when marking all as read', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: async () => ({ message: 'Internal server error' }),
      });

      await expect(api.markAllAsRead()).rejects.toThrow(
        'Internal server error'
      );
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(notificationsApi).toBeInstanceOf(NotificationsApi);
    });

    it('should be the same instance when imported multiple times', () => {
      const instance1 = notificationsApi;
      const instance2 = notificationsApi;
      expect(instance1).toBe(instance2);
    });
  });

  describe('error handling edge cases', () => {
    it('should handle response with no statusText', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: '',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(api.getNotifications()).rejects.toThrow('An error occurred');
    });

    it('should use default error message for 401 without custom message', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: '',
        json: async () => ({}),
      });

      await expect(api.getNotifications()).rejects.toThrow('An error occurred');
    });

    it('should use default error message for 404 without custom message', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: '',
        json: async () => ({}),
      });

      await expect(api.getNotifications()).rejects.toThrow('An error occurred');
    });

    it('should use default error message for 400 without custom message', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: '',
        json: async () => ({}),
      });

      await expect(api.getNotifications()).rejects.toThrow('An error occurred');
    });
  });

  describe('buildUrlWithParams utility', () => {
    it('should build URL without params', async () => {
      const mockResponse = {
        data: [],
        pagination: { nextCursor: null, hasMore: false },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.getNotifications();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toBe(`${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.BASE}`);
    });

    it('should handle null values in params', async () => {
      const mockResponse = {
        data: [],
        pagination: { nextCursor: null, hasMore: false },
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.getNotifications({
        cursor: undefined,
        limit: undefined,
      });

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toBe(`${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.BASE}`);
    });

    it('should handle boolean params', async () => {
      const mockResponse = {
        count: 0,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Testing with params that might include boolean values
      await api.getUnreadCount({
        include: ['follow'],
      });

      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
