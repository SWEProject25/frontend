import {
  ProfileResponseDto,
  UpdateProfileDto,
  ProfileSearchResponseDto,
  SearchProfilesParams,
  UserProfile,
} from '../types/api';
import {
  mockCurrentUserProfile,
  getMockProfileByUserId,
  getMockProfileByUsername,
  searchMockProfiles,
  mockUserProfiles,
} from '@/mocks/mockData';

/**
 * Mock Profile API Service
 * Simulates API responses with realistic delays for development and testing
 */

// Simulate network delay
const delay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock error class
class MockApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

export const mockProfileApi = {
  /**
   * Get current user's profile
   * Simulates: GET /api/v1.0/profile/me
   */
  async getMyProfile(): Promise<ProfileResponseDto> {
    await delay(300);

    // Simulate 5% chance of error
    if (Math.random() < 0.05) {
      throw new MockApiError('Failed to fetch profile', 500);
    }

    return {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: { ...mockCurrentUserProfile },
    };
  },

  /**
   * Update current user's profile
   * Simulates: PATCH /api/v1.0/profile/me
   */
  async updateMyProfile(
    profileData: UpdateProfileDto
  ): Promise<ProfileResponseDto> {
    await delay(500);

    // Simulate validation errors
    if (profileData.website && !profileData.website.startsWith('http')) {
      throw new MockApiError('Website must be a valid URL', 400);
    }

    if (profileData.bio && profileData.bio.length > 500) {
      throw new MockApiError('Bio must be less than 500 characters', 400);
    }

    // Create updated profile
    const updatedProfile: UserProfile = {
      ...mockCurrentUserProfile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedProfile,
    };
  },

  /**
   * Get profile by user ID
   * Simulates: GET /api/v1.0/profile/user/{userId}
   */
  async getProfileByUserId(userId: number): Promise<ProfileResponseDto> {
    await delay(300);

    const profile = getMockProfileByUserId(userId);

    if (!profile) {
      throw new MockApiError('Profile not found', 404);
    }

    return {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: { ...profile },
    };
  },

  /**
   * Get profile by username
   * Simulates: GET /api/v1.0/profile/username/{username}
   */
  async getProfileByUsername(username: string): Promise<ProfileResponseDto> {
    await delay(300);

    const profile = getMockProfileByUsername(username);

    if (!profile) {
      throw new MockApiError('Profile not found', 404);
    }

    return {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: { ...profile },
    };
  },

  /**
   * Search profiles
   * Simulates: GET /api/v1.0/profile/search?query=...&page=...&limit=...
   */
  async searchProfiles(
    params: SearchProfilesParams
  ): Promise<ProfileSearchResponseDto> {
    await delay(400);

    const { query, page = 1, limit = 10 } = params;

    // Validate query
    if (!query || query.trim().length === 0) {
      throw new MockApiError('Search query is required', 400);
    }

    // Search profiles
    const results = searchMockProfiles(query);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Simulate no results
    if (results.length === 0) {
      return {
        status: 'success',
        message: 'No profiles found',
        data: [],
        metadata: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    return {
      status: 'success',
      message: 'Profiles found successfully',
      data: paginatedResults.map((profile) => ({ ...profile })),
      metadata: {
        total: results.length,
        page,
        limit,
        totalPages: Math.ceil(results.length / limit),
      },
    };
  },

  /**
   * Get all profiles (useful for testing)
   * Not part of the official API
   */
  async getAllProfiles(): Promise<ProfileSearchResponseDto> {
    await delay(300);

    return {
      status: 'success',
      message: 'All profiles retrieved successfully',
      data: mockUserProfiles.map((profile) => ({ ...profile })),
      metadata: {
        total: mockUserProfiles.length,
        page: 1,
        limit: mockUserProfiles.length,
        totalPages: 1,
      },
    };
  },
};

/**
 * Mock API with error scenarios for testing
 */
export const mockProfileApiWithErrors = {
  ...mockProfileApi,

  // Always returns 401 Unauthorized
  async getMyProfileUnauthorized(): Promise<ProfileResponseDto> {
    await delay(300);
    throw new MockApiError('Unauthorized - Token missing or invalid', 401);
  },

  // Always returns 404 Not Found
  async getProfileNotFound(): Promise<ProfileResponseDto> {
    await delay(300);
    throw new MockApiError('Profile not found', 404);
  },

  // Always returns 500 Server Error
  async updateProfileServerError(): Promise<ProfileResponseDto> {
    await delay(500);
    throw new MockApiError('Internal server error', 500);
  },

  // Returns validation error
  async updateProfileValidationError(): Promise<ProfileResponseDto> {
    await delay(300);
    throw new MockApiError('Invalid input data', 400);
  },
};
