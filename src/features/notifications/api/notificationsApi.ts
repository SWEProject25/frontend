import { API_CONFIG } from '@/constants/api';
import {
  GetNotificationsResponse,
  GetUnreadCountResponse,
  GetNotificationsParams,
  Notification,
} from '../types';
import { NOTIFICATION_ENDPOINTS } from '../constants';

/**
 * API Error class
 */
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    const statusCode = response.status;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    // User-friendly error messages
    if (statusCode === 401) {
      errorMessage = errorMessage || 'Unauthorized - Please log in';
    }

    if (statusCode === 404) {
      errorMessage = errorMessage || 'Notification not found';
    }

    if (statusCode === 400) {
      errorMessage =
        errorMessage || 'Invalid request. Please check your input.';
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

/**
 * Build URL with query parameters
 */
function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Notifications API Class
 */
export class NotificationsApi {
  /**
   * Get paginated notifications for authenticated user
   */
  async getNotifications(
    params?: GetNotificationsParams
  ): Promise<GetNotificationsResponse> {
    const url = buildUrlWithParams(
      `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.BASE}`,
      params as Record<string, string | number | boolean | undefined>
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return handleResponse<GetNotificationsResponse>(response);
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<GetUnreadCountResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.UNREAD_COUNT}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<GetUnreadCountResponse>(response);
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.MARK_READ(notificationId)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<Notification>(response);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string }> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${NOTIFICATION_ENDPOINTS.MARK_ALL_READ}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<{ message: string }>(response);
  }
}

// Export singleton instance
export const notificationsApi = new NotificationsApi();
