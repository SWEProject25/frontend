import {
  ProfileResponseDto,
  UpdateProfileDto,
  ProfileSearchResponseDto,
  SearchProfilesParams,
  ProfileFeedDtoResponse,
  ProfileMediaFeedDtoResponse,
  UserProfile,
} from '../types/api';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';
import { API_CONFIG } from '@/constants/api';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';

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

  // Upload profile image (multipart/form-data)
  async uploadProfileImage(file: File): Promise<ProfileResponseDto> {
    const form = new FormData();
    form.append('file', file, file.name);

    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.ADD_PROFILE_IMAGE}`,
      {
        method: 'POST',
        credentials: 'include',
        body: form,
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Upload banner image (multipart/form-data)
  async uploadBannerImage(file: File): Promise<ProfileResponseDto> {
    const form = new FormData();
    // Backend expects field name `banner_image` and a filename with extension
    form.append('file', file, file.name);

    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.ADD_BANNER_IMAGE}`,
      {
        method: 'POST',
        credentials: 'include',
        body: form,
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Remove profile image
  async removeProfileImage(): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.REMOVE_PROFILE_IMAGE}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    return handleResponse<ProfileResponseDto>(response);
  },

  // Remove banner image
  async removeBannerImage(): Promise<ProfileResponseDto> {
    const response = await fetch(
      `${PROFILE_API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.REMOVE_BANNER_IMAGE}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
  async getProfileMentionsFeed(
    pageNumber = 1,
    user: number,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_MENTIONS(user)}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const data = await handleResponse<ProfileFeedDtoResponse>(response);

    // return {
    //   ...data,
    //   data: { posts: data.data },
    // };
    return {
      ...data,
      data: {
        ...data.data,
        posts: data.data.map((post) => ({
          ...post,
          postId: post.postId ?? post.originalPostData?.postId,
        })),
      },
    };
  },

  async getProfilePostsFeed(
    pageNumber = 1,
    user: 'me' | number,
    profile: UserProfile,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_POSTS(user)}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    // return handleResponse<ProfileFeedDtoResponse>(response);
    const data = await handleResponse<ProfileFeedDtoResponse>(response);
    console.log(data);
    // return {
    //   ...data,
    //   data: { posts: data.data },
    // };
    return {
      ...data,
      data: {
        ...data.data,
        posts: data.data.map((post) => ({
          ...post,
          postId: post.postId ?? post.originalPostData?.postId,
        })),
      },
    };
  },

  async getProfileLikesFeed(
    pageNumber = 1,
    user: number,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_LIKES(user)}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const data = await handleResponse<ProfileFeedDtoResponse>(response);

    // return {
    //   ...data,
    //   data: { posts: data.data },
    // };
    return {
      ...data,
      data: {
        ...data.data,
        posts: data.data.map((post) => ({
          ...post,
          postId: post.postId ?? post.originalPostData?.postId,
        })),
      },
    };
  },

  async getProfileMediaFeed(
    pageNumber = 1,
    user: number | 'me',
    limit = 10
  ): Promise<ProfileMediaFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_MEDIA(user)}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    return handleResponse<ProfileMediaFeedDtoResponse>(response);
  },

  async getProfileRepliesFeed(
    pageNumber = 1,
    user: 'me' | number,
    limit = 10
  ): Promise<TimelineFeedDtoResponse> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_REPLIES(user)}?` +
        new URLSearchParams({ page: `${pageNumber}`, limit: `${limit}` }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    const data = await handleResponse<ProfileFeedDtoResponse>(response);

    return {
      ...data,
      data: { posts: data.data },
    };
  },
};
