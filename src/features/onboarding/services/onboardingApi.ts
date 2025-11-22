import {
  UpdateDateOfBirthDto,
  UpdateDateOfBirthResponseDto,
  UpdateInterestsDto,
  UpdateInterestsResponseDto,
  FollowUserDto,
  FollowUserResponseDto,
  UnfollowUserDto,
  UnfollowUserResponseDto,
  GetSuggestedUsersDto,
  GetSuggestedUsersResponseDto,
  GetInterestsResponseDto,
} from '../types/api';
import { ONBOARDING_API_CONFIG, ONBOARDING_ENDPOINTS } from '../constants/api';

// API Error handling
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

    throw new ApiError(errorMessage, statusCode);
  }

  return response.json();
}

export const onboardingApi = {
  // Get all available interests
  getInterests: async (): Promise<GetInterestsResponseDto> => {
    const response = await fetch(
      `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.GET_INTERESTS}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
    return handleResponse<GetInterestsResponseDto>(response);
  },

  // Update date of birth
  updateDateOfBirth: async (
    data: UpdateDateOfBirthDto
  ): Promise<UpdateDateOfBirthResponseDto> => {
    const response = await fetch(
      `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.UPDATE_DATE_OF_BIRTH}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ birth_date: data.dateOfBirth }),
      }
    );
    return handleResponse<UpdateDateOfBirthResponseDto>(response);
  },

  // Update interests
  updateInterests: async (
    data: UpdateInterestsDto
  ): Promise<UpdateInterestsResponseDto> => {
    const response = await fetch(
      `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.UPDATE_INTERESTS}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      }
    );
    return handleResponse<UpdateInterestsResponseDto>(response);
  },

  // Follow a user
  followUser: async (data: FollowUserDto): Promise<FollowUserResponseDto> => {
    const response = await fetch(
      `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.FOLLOW_USER(data.userId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );
    return handleResponse<FollowUserResponseDto>(response);
  },

  // Unfollow a user
  unfollowUser: async (
    data: UnfollowUserDto
  ): Promise<UnfollowUserResponseDto> => {
    const response = await fetch(
      `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.UNFOLLOW_USER(data.userId)}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );
    return handleResponse<UnfollowUserResponseDto>(response);
  },

  // Get suggested users to follow
  getSuggestedUsers: async (
    params?: GetSuggestedUsersDto
  ): Promise<GetSuggestedUsersResponseDto> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.excludeFollowed !== undefined) {
      queryParams.append('excludeFollowed', params.excludeFollowed.toString());
    }
    if (params?.excludeBlocked !== undefined) {
      queryParams.append('excludeBlocked', params.excludeBlocked.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}?${queryString}`
      : `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<GetSuggestedUsersResponseDto>(response);
  },
};
