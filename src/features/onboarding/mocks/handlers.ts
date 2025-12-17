import { http, HttpResponse } from 'msw';
import { ONBOARDING_ENDPOINTS } from '../constants/api';
import { mockSuggestedUsers } from './mockData';

/**
 * MSW Request Handlers for Onboarding API
 * These handlers intercept HTTP requests and return mock responses
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const buildUrl = (endpoint: string) => `${BASE_URL}${endpoint}`;

export const onboardingHandlers = [
  // GET /api/v1.0/users/interests - Get all available interests
  http.get(buildUrl(ONBOARDING_ENDPOINTS.GET_INTERESTS), () => {
    return HttpResponse.json(
      {
        status: 'success',
        message: 'Successfully retrieved interests',
        total: 16,
        data: [
          {
            id: 1,
            name: 'Technology',
            slug: 'technology',
            description: 'Stay updated with the latest tech trends',
            icon: '💻',
          },
          {
            id: 2,
            name: 'Sports',
            slug: 'sports',
            description: 'Follow your favorite teams and athletes',
            icon: '⚽',
          },
          {
            id: 3,
            name: 'Music',
            slug: 'music',
            description: 'Discover new artists and tracks',
            icon: '🎵',
          },
          {
            id: 4,
            name: 'Gaming',
            slug: 'gaming',
            description: 'Latest gaming news and updates',
            icon: '🎮',
          },
          {
            id: 5,
            name: 'Fashion',
            slug: 'fashion',
            description: 'Latest fashion trends and styles',
            icon: '👗',
          },
          {
            id: 6,
            name: 'Food',
            slug: 'food',
            description: 'Recipes, restaurants, and culinary delights',
            icon: '🍕',
          },
          {
            id: 7,
            name: 'Travel',
            slug: 'travel',
            description: 'Explore destinations around the world',
            icon: '✈️',
          },
          {
            id: 8,
            name: 'Movies & TV',
            slug: 'movies-tv',
            description: 'Latest entertainment and reviews',
            icon: '🎬',
          },
          {
            id: 9,
            name: 'News',
            slug: 'news',
            description: 'Stay informed with current events',
            icon: '📰',
          },
          {
            id: 10,
            name: 'Science',
            slug: 'science',
            description: 'Discover scientific breakthroughs',
            icon: '🔬',
          },
          {
            id: 11,
            name: 'Art & Design',
            slug: 'art-design',
            description: 'Creative inspiration and art trends',
            icon: '🎨',
          },
          {
            id: 12,
            name: 'Business & Finance',
            slug: 'business-finance',
            description: 'Market trends and business news',
            icon: '💼',
          },
          {
            id: 13,
            name: 'Celebrity',
            slug: 'celebrity',
            description: 'Celebrity news and gossip',
            icon: '⭐',
          },
          {
            id: 14,
            name: 'Relationships',
            slug: 'relationships',
            description: 'Dating advice and relationship tips',
            icon: '💑',
          },
          {
            id: 15,
            name: 'Dance',
            slug: 'dance',
            description: 'Dance trends and performances',
            icon: '💃',
          },
          {
            id: 16,
            name: 'Fitness',
            slug: 'fitness',
            description: 'Workout tips and health advice',
            icon: '💪',
          },
        ],
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // GET /api/v1.0/users/suggested - Get suggested users to follow
  http.get(buildUrl(ONBOARDING_ENDPOINTS.SUGGESTED_USERS), ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 10;

    // Apply limit to mock data
    const limitedData = mockSuggestedUsers.slice(0, limit);

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Successfully retrieved suggested users',
        data: {
          users: limitedData,
        },
        total: mockSuggestedUsers.length, // Total available, not just returned
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }),

  // POST /api/v1.0/users/:userId/follow - Follow a user
  http.post(buildUrl('/api/v1.0/users/:userId/follow'), ({ params }) => {
    const userId = Number(params.userId);

    if (isNaN(userId)) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Invalid user ID',
        },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        status: 'success',
        message: 'Successfully followed user',
        data: {
          userId,
          isFollowing: true,
        },
      },
      { status: 200 }
    );
  }),

  // POST /api/v1.0/users/interests/me - Save user interests
  http.post(
    buildUrl(ONBOARDING_ENDPOINTS.UPDATE_INTERESTS),
    async ({ request }) => {
      const body = (await request.json()) as { interestIds?: number[] };

      if (!body.interestIds || body.interestIds.length === 0) {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Invalid interest IDs provided or no interests selected',
          },
          { status: 400 }
        );
      }

      return HttpResponse.json(
        {
          status: 'success',
          message:
            'Interests saved successfully. Please follow some users to complete onboarding.',
          savedCount: body.interestIds.length,
          nextStep: 'FOLLOWING',
        },
        { status: 200 }
      );
    }
  ),

  // PATCH /api/v1.0/profile/me - Update date of birth (reuses profile endpoint)
  // Note: The actual profile update is handled by profile handlers
  // This is just for documentation that DOB updates use the same endpoint
];
