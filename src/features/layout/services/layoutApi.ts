import {
  SuggestedUsersResponseDto,
  TrendingHashtagsResponseDto,
} from '../types/api';
import {
  LAYOUT_API_CONFIG,
  LAYOUT_ENDPOINTS,
  LAYOUT_CONSTANTS,
} from '../constants/api';

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

    if (statusCode === 401) {
      errorMessage = errorMessage || 'Unauthorized - Please log in';
    }

    if (statusCode === 404) {
      errorMessage = errorMessage || 'Resource not found';
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const layoutApi = {
  // Get suggested users to follow
  async getSuggestedUsers(
    limit: number = LAYOUT_CONSTANTS.DEFAULT_SUGGESTED_USERS_LIMIT,
    excludeFollowed: boolean = true,
    excludeBlocked: boolean = true
  ): Promise<SuggestedUsersResponseDto> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      excludeFollowed: excludeFollowed.toString(),
      excludeBlocked: excludeBlocked.toString(),
    });

    const response = await fetch(
      `${LAYOUT_API_CONFIG.BASE_URL}${LAYOUT_ENDPOINTS.GET_SUGGESTED_USERS}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<SuggestedUsersResponseDto>(response);
  },

  // Get trending hashtags
  async getTrendingHashtags(
    limit: number = LAYOUT_CONSTANTS.DEFAULT_TRENDING_HASHTAGS_LIMIT
  ): Promise<TrendingHashtagsResponseDto> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(
      `${LAYOUT_API_CONFIG.BASE_URL}${LAYOUT_ENDPOINTS.GET_TRENDING_HASHTAGS}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<TrendingHashtagsResponseDto>(response);
  },
};
