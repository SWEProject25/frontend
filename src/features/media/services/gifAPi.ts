import { GIF_ENDPOINTS } from '../constants/api';
import { GifResponse } from '../types/api';
import GifData from '../types/components';

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
  console.log(response);
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
    if (statusCode === 401) {
      errorMessage = errorMessage || 'Invalid token in query';
    }

    // Handle registration errors
    if (statusCode === 429) {
      errorMessage = errorMessage || 'API rate limit exceeded';
    }

    if (statusCode === 400) {
      errorMessage =
        errorMessage ||
        'Invalid input data. Please check your information and try again.';
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const gifApi = {
  async getCategories() {
    const promises: Promise<GifResponse>[] = GIF_ENDPOINTS.searchCategories.map(
      async (cat): Promise<GifResponse> => {
        const response = await fetch(`${cat}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // const data = await singleResponse.json();
        // return data;
        return handleResponse(response);
      }
    );
    // Wait for all promises to resolve
    const results = await Promise.all(promises);
    console.log(results);
    return results.map((res) => res.data[0]);
  },
};
