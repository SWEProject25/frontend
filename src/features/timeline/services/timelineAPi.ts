import { API_CONFIG } from '@/constants/api';
import { TIMELINE_ENDPOINTS } from '../constants/api';
import { AddTweetResponse, TimelineFeedDtoResponse } from '../types/api';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: unknown,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    const statusCode = response.status;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    // Provide user-friendly error messages for common errors

    if (statusCode === 400) {
      errorMessage =
        errorMessage ||
        'Invalid input data. Please check your information and try again.';
    }

    if (statusCode === 401) {
      errorMessage =
        errorMessage ||
        'Invalid user You are unauthorized . Please log out and try again.';
    }

    throw new ApiError(errorMessage, statusCode);
    // console.log(errorMessage, statusCode);
  }

  return response.json();
}

export const timelineApi = {
  async addTweet(tweetData: FormData): Promise<AddTweetResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${TIMELINE_ENDPOINTS.ADD_TWEET}`,
      {
        method: 'POST',
        body: tweetData,
        credentials: 'include',
      }
    );
    return handleResponse<AddTweetResponse>(response);
  },
  async getTimelineFeed(
    pageNumber = 1,
    queryEndPoint:
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING
      | typeof TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${queryEndPoint}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return handleResponse<TimelineFeedDtoResponse>(response);
  },
};
