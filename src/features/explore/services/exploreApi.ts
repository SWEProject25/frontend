import { API_CONFIG } from '@/constants/api';
import { EXPLORE_ENDPOINTS } from '../constants/api';
import { TOP_TAB, TRENDING_TAB } from '../constants/tabs';
import {
  ExploreSearchFeedDtoResponse,
  ExploreTrendingFeedDtoResponse,
} from '../types/api';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';

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
  const data = await response.json();
  console.log(data);
  return data;
}
export const exploreApi = {
  async getSearchFeed(
    pageNumber = 1,
    query: string,
    queryEndPoint: string,
    type = 'searchQuery',
    tab = TOP_TAB,
    date = '',
    limit = 10
  ): Promise<ExploreSearchFeedDtoResponse> {
    const params =
      tab === TOP_TAB
        ? new URLSearchParams({
            page: `${pageNumber}`,
            limit: `${limit}`,
            [type]: `${query}`,
          })
        : new URLSearchParams({
            page: `${pageNumber}`,
            limit: `${limit}`,
            [type]: `${query}`,
            order_by: `latest`,
            before_date: `${date}`,
          });
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${queryEndPoint}?` + params,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ExploreSearchFeedDtoResponse>(response);
  },

  async getForYouFeed(
    pageNumber = 1,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${EXPLORE_ENDPOINTS.EXPLORE_FEED_FOR_YOU}?` +
        new URLSearchParams({
          page: `${pageNumber}`,
          limit: `${limit} `,
        }),
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

  async getTrendingFeed(
    category = TRENDING_TAB,
    limit = 10
  ): Promise<ExploreTrendingFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${EXPLORE_ENDPOINTS.EXPLORE_FEED_TRENDING}?` +
        new URLSearchParams({
          limit: `${limit} `,
          category: category,
        }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ExploreTrendingFeedDtoResponse>(response);
  },
};
