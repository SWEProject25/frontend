const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1.0';

export interface SuggestedUser {
  id: number;
  username: string;
  email: string;
  profile: {
    name: string;
    bio?: string;
    profileImageUrl?: string;
    bannerImageUrl?: string;
    location?: string;
    website?: string;
  };
  followersCount: number;
  isVerified: boolean;
}

export interface SuggestedUsersResponse {
  status: string;
  data: SuggestedUser[];
  total: number;
  message: string;
}

/**
 * Fetch suggested users to follow from the backend
 * @param limit - Number of users to retrieve (default: 5)
 * @param excludeFollowed - Exclude already followed users (default: true)
 * @param excludeBlocked - Exclude blocked users (default: true)
 */
export const fetchSuggestedUsers = async (
  limit: number = 5,
  excludeFollowed: boolean = true,
  excludeBlocked: boolean = true
): Promise<SuggestedUser[]> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    excludeFollowed: excludeFollowed.toString(),
    excludeBlocked: excludeBlocked.toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/${API_VERSION}/users/suggested?${params}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized - please log in');
    }
    throw new Error('Failed to fetch suggested users');
  }

  const data = await response.json();

  // Handle different response formats
  // Format 1: {status, message, total, data: {users: [...]}}
  if (data && typeof data === 'object' && 'data' in data) {
    if (
      typeof data.data === 'object' &&
      'users' in data.data &&
      Array.isArray(data.data.users)
    ) {
      return data.data.users;
    }
    // Format 2: {status, message, total, data: [...]}
    if (Array.isArray(data.data)) {
      return data.data;
    }
  }

  // Format 3: Direct array [...]
  if (Array.isArray(data)) {
    return data;
  }

  // Fallback to empty array if format is unexpected
  console.error('Unexpected API response format:', data);
  return [];
};
