import {
  ProfileResponseDto,
  UpdateProfileDto,
  ProfileSearchResponseDto,
  SearchProfilesParams,
} from '../types/api';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';

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
      errorMessage = errorMessage || 'Profile not found';
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

export const profileApi = {
  // Get current user's profile
  async getMyProfile(): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.GET_MY_PROFILE}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Update current user's profile
  async updateMyProfile(
    profileData: UpdateProfileDto
  ): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Get profile by user ID
  async getProfileByUserId(userId: number): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.GET_PROFILE_BY_USER_ID(userId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Get profile by username
  async getProfileByUsername(username: string): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.GET_PROFILE_BY_USERNAME(username)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Search profiles
  async searchProfiles(
    params: SearchProfilesParams
  ): Promise<ProfileSearchResponseDto> {
    const searchParams = new URLSearchParams({
      query: params.query,
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '10',
    });

    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.SEARCH_PROFILES}?${searchParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ProfileSearchResponseDto>(response);
  },
};
