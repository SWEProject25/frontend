import { http, HttpResponse } from 'msw';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';
import {
  mockCurrentUserProfile,
  getMockProfileByUserId,
  getMockProfileByUsername,
  searchMockProfiles,
} from '../../../mocks/mockData';
import type { UpdateProfileDto } from '../types/api';
import { API_CONFIG } from '@/constants/api';
import { profilePosts } from './data';
import { mockState } from './mockState';

/**
 * MSW Request Handlers for Profile API
 * These handlers intercept HTTP requests and return mock responses
 */

const buildUrl = (endpoint: string) =>
  `${PROFILE_API_CONFIG.BASE_URL}${endpoint}`;

export const profileHandlers = [
  // GET /api/v1.0/profile/me - Get current user's profile
  http.get(buildUrl(PROFILE_ENDPOINTS.GET_MY_PROFILE), () => {
    if (Math.random() < 0.05) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Failed to fetch profile',
          error: 'Internal Server Error',
        },
        { status: 500 }
      );
    }

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: mockCurrentUserProfile,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // PATCH /api/v1.0/profile/me - Update current user's profile
  http.patch(
    buildUrl(PROFILE_ENDPOINTS.UPDATE_MY_PROFILE),
    async ({ request }) => {
      const body = (await request.json()) as UpdateProfileDto;

      // Validate website URL
      if (body.website && !body.website.startsWith('http')) {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Website must be a valid URL',
            error: 'Bad Request',
          },
          { status: 400 }
        );
      }

      // Validate bio length
      if (body.bio && body.bio.length > 500) {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Bio must be less than 500 characters',
            error: 'Bad Request',
          },
          { status: 400 }
        );
      }

      Object.assign(mockCurrentUserProfile, {
        ...body,
        updatedAt: new Date().toISOString(),
      });

      return HttpResponse.json(
        {
          status: 'success',
          message: 'Profile updated successfully',
          data: mockCurrentUserProfile,
        },
        { status: 200 }
      );
    }
  ),

  // GET /api/v1.0/profile/user/:userId - Get profile by user ID
  http.get(buildUrl('/api/v1.0/profile/user/:userId'), ({ params }) => {
    const userId = Number(params.userId);

    if (isNaN(userId)) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Invalid user ID',
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    const profile = getMockProfileByUserId(userId);

    if (!profile) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Profile not found',
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: profile,
      },
      { status: 200 }
    );
  }),

  // GET /api/v1.0/profile/username/:username - Get profile by username
  http.get(buildUrl('/api/v1.0/profile/username/:username'), ({ params }) => {
    const username = params.username as string;

    const profile = getMockProfileByUsername(username);

    if (!profile) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Profile not found',
          error: 'Not Found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Profile retrieved successfully',
        data: profile,
      },
      { status: 200 }
    );
  }),

  // GET /api/v1.0/profile/search - Search profiles
  http.get(buildUrl(PROFILE_ENDPOINTS.SEARCH_PROFILES), ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    // Validate query
    if (!query || query.trim().length === 0) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Search query is required',
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    // Search profiles
    const results = searchMockProfiles(query);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);

    return HttpResponse.json(
      {
        status: 'success',
        message:
          results.length === 0
            ? 'No profiles found'
            : 'Profiles found successfully',
        data: paginatedResults,
        metadata: {
          total: results.length,
          page,
          limit,
          totalPages: Math.ceil(results.length / limit),
        },
      },
      { status: 200 }
    );
  }),
];

export const profileFeedHandlers = [
  http.get(
    `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_POSTS('me')}`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) ?? 1;
      const limit = Number(url.searchParams.get('limit')) ?? 10;
      console.log(mockState.user);
      return HttpResponse.json(
        {
          status: 'success',
          message: 'Posts retrieved successfully',
          data: {
            posts: profilePosts(mockState.user).slice(
              (page - 1) * limit,
              page * limit
            ),
          },
        },
        { status: 200 }
      );
    }
  ),
  http.get(
    `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_REPLIES('me')}`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) ?? 1;
      const limit = Number(url.searchParams.get('limit')) ?? 10;
      console.log(mockState.user);
      return HttpResponse.json(
        {
          status: 'success',
          message: 'Posts retrieved successfully',
          data: {
            posts: profilePosts(mockState.user).slice(
              (page - 1) * limit,
              page * limit
            ),
          },
        },
        { status: 200 }
      );
    }
  ),

  http.get(
    `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_POSTS(':id')}`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) ?? 1;
      const limit = Number(url.searchParams.get('limit')) ?? 10;
      console.log(mockState.user);
      return HttpResponse.json(
        {
          status: 'success',
          message: 'Posts retrieved successfully',
          data: {
            posts: profilePosts(mockState.user).slice(
              (page - 1) * limit,
              page * limit
            ),
          },
        },
        { status: 200 }
      );
    }
  ),

  http.get(
    `${API_CONFIG.BASE_URL}${PROFILE_ENDPOINTS.PROFILE_REPLIES(':id')}`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page')) ?? 1;
      const limit = Number(url.searchParams.get('limit')) ?? 10;
      console.log(mockState.user);
      return HttpResponse.json(
        {
          status: 'success',
          message: 'Posts retrieved successfully',
          data: {
            posts: profilePosts(mockState.user).slice(
              (page - 1) * limit,
              page * limit
            ),
          },
        },
        { status: 200 }
      );
    }
  ),
];

/**
 * Error scenario handlers for testing
 * Use these to test error handling in your components
 */

export const profileErrorHandlers = [
  // Always returns 401 Unauthorized
  http.get(buildUrl(PROFILE_ENDPOINTS.GET_MY_PROFILE), () => {
    return HttpResponse.json(
      {
        status: 'error',
        message: 'Unauthorized - Token missing or invalid',
        error: 'Unauthorized',
      },
      { status: 401 }
    );
  }),

  // Always returns 404 Not Found
  http.get(buildUrl('/api/v1.0/profile/username/:username'), () => {
    return HttpResponse.json(
      {
        status: 'error',
        message: 'Profile not found',
        error: 'Not Found',
      },
      { status: 404 }
    );
  }),

  // Always returns validation error
  http.patch(buildUrl(PROFILE_ENDPOINTS.UPDATE_MY_PROFILE), () => {
    return HttpResponse.json(
      {
        status: 'error',
        message: 'Invalid input data',
        error: 'Bad Request',
      },
      { status: 400 }
    );
  }),
];
