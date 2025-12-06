const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1.0';

export interface TrendingHashtag {
  hashtag: string;
  count: number;
  period?: string;
}

export interface TrendingHashtagsResponse {
  hashtags: TrendingHashtag[];
}

/**
 * Fetch trending hashtags from the API
 * @param limit - Number of trending hashtags to return (1-50)
 */
export const fetchTrendingHashtags = async (
  limit: number = 10
): Promise<TrendingHashtag[]> => {
  // Ensure limit is between 1 and 50
  const validLimit = Math.max(1, Math.min(50, limit));

  const response = await fetch(
    `${API_BASE_URL}/api/${API_VERSION}/hashtags/trending?limit=${validLimit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Limit must be between 1 and 50');
    }
    throw new Error('Failed to fetch trending hashtags');
  }

  const data = await response.json();

  // Handle different response formats
  if (data.hashtags && Array.isArray(data.hashtags)) {
    return data.hashtags;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
};
