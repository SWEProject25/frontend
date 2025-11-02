import { TweetResponseDto } from '../types';
import { TWEET_API_CONFIG, TWEET_ENDPOINTS } from '../constants/api';

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
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    if (statusCode === 404) {
      errorMessage = errorMessage || 'Tweet not found';
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const tweetApi = {
  async getTweetById(tweetId: number): Promise<TweetResponseDto> {
    const response = await fetch(
      `${TWEET_API_CONFIG.BASE_URL}${TWEET_ENDPOINTS.GET_TWEET_BY_ID(tweetId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return handleResponse<TweetResponseDto>(response);
  },

  async toggleLikeTweet(tweetId: number): Promise<{ liked: boolean }> {
    const response = await fetch(
      `${TWEET_API_CONFIG.BASE_URL}${TWEET_ENDPOINTS.TOGGLE_LIKE_TWEET(tweetId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return handleResponse<{ liked: boolean }>(response);
  },

  async toggleRepostTweet(tweetId: number): Promise<{ reposted: boolean }> {
    const response = await fetch(
      `${TWEET_API_CONFIG.BASE_URL}${TWEET_ENDPOINTS.TOGGLE_REPOST_TWEET(tweetId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return handleResponse<{ reposted: boolean }>(response);
  },
};
