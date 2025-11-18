import {
  FollowResponseDto,
  FollowersListResponseDto,
  FollowingListResponseDto,
  BlockResponseDto,
  BlockedUsersListResponseDto,
  MuteResponseDto,
  MutedUsersListResponseDto,
  PaginationParams,
} from '@/types/userInteractions';
import {
  API_CONFIG,
  FOLLOW_API_ENDPOINTS,
  BLOCK_API_ENDPOINTS,
  MUTE_API_ENDPOINTS,
} from '@/constants/api';

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

    // Provide user-friendly error messages for common errors
    if (statusCode === 401) {
      errorMessage = errorMessage || 'Unauthorized - Please log in';
    }

    if (statusCode === 404) {
      errorMessage = errorMessage || 'User not found';
    }

    if (statusCode === 400) {
      errorMessage =
        errorMessage || 'Invalid request. Please check your input.';
    }

    if (statusCode === 409) {
      errorMessage = errorMessage || 'Action already performed';
    }

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

// Follow API Class
export class FollowApi {
  // Follow a user
  async followUser(userId: number): Promise<FollowResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${FOLLOW_API_ENDPOINTS.FOLLOW_USER(userId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<FollowResponseDto>(response);
  }

  // Unfollow a user
  async unfollowUser(userId: number): Promise<FollowResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${FOLLOW_API_ENDPOINTS.UNFOLLOW_USER(userId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<FollowResponseDto>(response);
  }

  // Get user's followers
  async getFollowers(
    userId: number,
    params?: PaginationParams
  ): Promise<FollowersListResponseDto> {
    const searchParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '20',
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${FOLLOW_API_ENDPOINTS.GET_FOLLOWERS(userId)}?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<FollowersListResponseDto>(response);
  }

  // Get users that a user is following
  async getFollowing(
    userId: number,
    params?: PaginationParams
  ): Promise<FollowingListResponseDto> {
    const searchParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '20',
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${FOLLOW_API_ENDPOINTS.GET_FOLLOWING(userId)}?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<FollowingListResponseDto>(response);
  }
}

// Block API Class
export class BlockApi {
  // Block a user
  async blockUser(userId: number): Promise<BlockResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${BLOCK_API_ENDPOINTS.BLOCK_USER(userId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<BlockResponseDto>(response);
  }

  // Unblock a user
  async unblockUser(userId: number): Promise<BlockResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${BLOCK_API_ENDPOINTS.UNBLOCK_USER(userId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<BlockResponseDto>(response);
  }

  // Get list of blocked users
  async getBlockedUsers(
    params?: PaginationParams
  ): Promise<BlockedUsersListResponseDto> {
    const searchParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '20',
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${BLOCK_API_ENDPOINTS.GET_BLOCKED_USERS}?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<BlockedUsersListResponseDto>(response);
  }
}

// Mute API Class
export class MuteApi {
  // Mute a user
  async muteUser(userId: number): Promise<MuteResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${MUTE_API_ENDPOINTS.MUTE_USER(userId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<MuteResponseDto>(response);
  }

  // Unmute a user
  async unmuteUser(userId: number): Promise<MuteResponseDto> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${MUTE_API_ENDPOINTS.UNMUTE_USER(userId)}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<MuteResponseDto>(response);
  }

  // Get list of muted users
  async getMutedUsers(
    params?: PaginationParams
  ): Promise<MutedUsersListResponseDto> {
    const searchParams = new URLSearchParams({
      page: params?.page?.toString() || '1',
      limit: params?.limit?.toString() || '20',
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${MUTE_API_ENDPOINTS.GET_MUTED_USERS}?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<MutedUsersListResponseDto>(response);
  }
}

// Export instances
export const followApi = new FollowApi();
export const blockApi = new BlockApi();
export const muteApi = new MuteApi();
