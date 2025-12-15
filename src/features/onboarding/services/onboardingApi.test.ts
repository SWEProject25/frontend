import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { onboardingApi } from './onboardingApi';
import { ONBOARDING_API_CONFIG, ONBOARDING_ENDPOINTS } from '../constants/api';

// Store original fetch
const originalFetch = global.fetch;

describe('onboardingApi', () => {
  beforeEach(() => {
    // Mock fetch before each test
    global.fetch = vi.fn() as any;
  });

  afterEach(() => {
    // Restore original fetch after each test
    global.fetch = originalFetch;
  });

  describe('getInterests', () => {
    const mockInterestsResponse = {
      status: 'success',
      message: 'Interests retrieved',
      total: 3,
      data: [
        {
          id: 1,
          name: 'Technology',
          slug: 'technology',
          description: 'Tech interests',
          icon: 'icon1',
        },
        {
          id: 2,
          name: 'Sports',
          slug: 'sports',
          description: 'Sports interests',
          icon: 'icon2',
        },
        {
          id: 3,
          name: 'Music',
          slug: 'music',
          description: 'Music interests',
          icon: 'icon3',
        },
      ],
    };

    it('should fetch interests successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInterestsResponse,
      });

      const result = await onboardingApi.getInterests();

      expect(result).toEqual(mockInterestsResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.GET_INTERESTS}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should handle fetch error with error message', async () => {
      const errorResponse = {
        message: 'Failed to fetch interests',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => errorResponse,
      });

      await expect(onboardingApi.getInterests()).rejects.toThrow(
        'Failed to fetch interests'
      );
    });

    it('should handle fetch error without error message', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(onboardingApi.getInterests()).rejects.toThrow(
        'Internal Server Error'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(onboardingApi.getInterests()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('updateDateOfBirth', () => {
    const mockDateOfBirthData = { dateOfBirth: '1990-05-15' };
    const mockResponse = {
      status: 'success',
      message: 'Birth date updated',
      data: {
        id: 1,
        user_id: 1,
        name: 'Test User',
        birthDate: '1990-05-15',
        profileImageUrl: null,
        bannerImageUrl: null,
        bio: null,
        location: null,
        website: null,
        is_deactivated: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        User: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'user',
          created_at: '2024-01-01',
        },
        followersCount: 0,
        followingCount: 0,
      },
    };

    it('should update date of birth successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await onboardingApi.updateDateOfBirth(mockDateOfBirthData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.UPDATE_DATE_OF_BIRTH}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ birth_date: '1990-05-15' }),
        }
      );
    });

    it('should handle validation error', async () => {
      const errorResponse = {
        message: 'Invalid date format',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      });

      await expect(
        onboardingApi.updateDateOfBirth(mockDateOfBirthData)
      ).rejects.toThrow('Invalid date format');
    });

    it('should handle server error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(
        onboardingApi.updateDateOfBirth(mockDateOfBirthData)
      ).rejects.toThrow('Internal Server Error');
    });
  });

  describe('updateInterests', () => {
    const mockInterestsData = { interestIds: [1, 2, 3] };
    const mockResponse = {
      status: 'success',
      message: 'Interests updated',
      savedCount: 3,
      nextStep: 'follow_suggestions',
    };

    it('should update interests successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await onboardingApi.updateInterests(mockInterestsData);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.UPDATE_INTERESTS}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(mockInterestsData),
        }
      );
    });

    it('should handle empty interest array', async () => {
      const emptyData = { interestIds: [] };
      const errorResponse = {
        message: 'At least one interest must be selected',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      });

      await expect(onboardingApi.updateInterests(emptyData)).rejects.toThrow(
        'At least one interest must be selected'
      );
    });

    it('should handle unauthorized error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(
        onboardingApi.updateInterests(mockInterestsData)
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('getSuggestedUsers', () => {
    const mockSuggestedUsersResponse = {
      status: 'success',
      message: 'Suggested users retrieved',
      total: 2,
      data: {
        users: [
          {
            id: 2,
            username: 'johndoe',
            email: 'john@example.com',
            isVerified: true,
            profile: {
              name: 'John Doe',
              bio: 'Software developer',
              profileImageUrl: 'avatar1.jpg',
            },
            followersCount: 1250,
          },
          {
            id: 3,
            username: 'janedoe',
            email: 'jane@example.com',
            isVerified: false,
            profile: {
              name: 'Jane Doe',
              bio: 'Designer',
              profileImageUrl: 'avatar2.jpg',
            },
            followersCount: 800,
          },
        ],
      },
    };

    it('should fetch suggested users without params', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestedUsersResponse,
      });

      const result = await onboardingApi.getSuggestedUsers();

      expect(result).toEqual(mockSuggestedUsersResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should fetch suggested users with all params', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestedUsersResponse,
      });

      const params = {
        limit: 10,
        excludeFollowed: true,
        excludeBlocked: true,
      };

      const result = await onboardingApi.getSuggestedUsers(params);

      expect(result).toEqual(mockSuggestedUsersResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}?limit=10&excludeFollowed=true&excludeBlocked=true`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should fetch suggested users with limit only', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestedUsersResponse,
      });

      const params = { limit: 5 };

      const result = await onboardingApi.getSuggestedUsers(params);

      expect(result).toEqual(mockSuggestedUsersResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}?limit=5`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should handle excludeFollowed false correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestedUsersResponse,
      });

      const params = {
        limit: 10,
        excludeFollowed: false,
      };

      const result = await onboardingApi.getSuggestedUsers(params);

      expect(result).toEqual(mockSuggestedUsersResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}?limit=10&excludeFollowed=false`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should handle excludeBlocked false correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestedUsersResponse,
      });

      const params = {
        excludeBlocked: false,
      };

      const result = await onboardingApi.getSuggestedUsers(params);

      expect(result).toEqual(mockSuggestedUsersResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ONBOARDING_API_CONFIG.BASE_URL}${ONBOARDING_ENDPOINTS.SUGGESTED_USERS}?excludeBlocked=false`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
    });

    it('should handle empty suggested users list', async () => {
      const emptyResponse = {
        status: 'success',
        message: 'No suggestions available',
        total: 0,
        data: {
          users: [],
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => emptyResponse,
      });

      const result = await onboardingApi.getSuggestedUsers();

      expect(result).toEqual(emptyResponse);
      expect(result.data.users).toHaveLength(0);
    });

    it('should handle fetch error', async () => {
      const errorResponse = {
        message: 'Failed to fetch suggested users',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => errorResponse,
      });

      await expect(onboardingApi.getSuggestedUsers()).rejects.toThrow(
        'Failed to fetch suggested users'
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw ApiError with status code', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      });

      try {
        await onboardingApi.getInterests();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.name).toBe('ApiError');
        expect(error.message).toBe('Not found');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle 401 Unauthorized error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      try {
        await onboardingApi.getInterests();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBe(401);
      }
    });

    it('should handle 403 Forbidden error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: 'Forbidden' }),
      });

      try {
        await onboardingApi.updateInterests({ interestIds: [1, 2] });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Forbidden');
        expect(error.statusCode).toBe(403);
      }
    });

    it('should use default error message when response has no message', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}), // No 'message' field in JSON
      });

      try {
        await onboardingApi.getInterests();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // When JSON parsing succeeds but no message field, uses default "An error occurred"
        expect(error.message).toBe('An error occurred');
      }
    });

    it('should use generic error message when JSON parsing fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: '',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      try {
        await onboardingApi.getInterests();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('An error occurred');
      }
    });
  });

  describe('Request Configuration', () => {
    it('should include credentials in all requests', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await onboardingApi.getInterests();
      await onboardingApi.updateDateOfBirth({ dateOfBirth: '1990-01-01' });
      await onboardingApi.updateInterests({ interestIds: [1] });
      await onboardingApi.getSuggestedUsers();

      const calls = (global.fetch as any).mock.calls;
      calls.forEach((call: any) => {
        expect(call[1].credentials).toBe('include');
      });
    });

    it('should use correct HTTP methods', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await onboardingApi.getInterests();
      expect((global.fetch as any).mock.calls[0][1].method).toBe('GET');

      await onboardingApi.updateDateOfBirth({ dateOfBirth: '1990-01-01' });
      expect((global.fetch as any).mock.calls[1][1].method).toBe('PATCH');

      await onboardingApi.updateInterests({ interestIds: [1] });
      expect((global.fetch as any).mock.calls[2][1].method).toBe('POST');

      await onboardingApi.getSuggestedUsers();
      expect((global.fetch as any).mock.calls[3][1].method).toBe('GET');
    });

    it('should include Content-Type header for POST/PATCH requests', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      await onboardingApi.updateDateOfBirth({ dateOfBirth: '1990-01-01' });
      expect((global.fetch as any).mock.calls[0][1].headers).toEqual({
        'Content-Type': 'application/json',
      });

      await onboardingApi.updateInterests({ interestIds: [1] });
      expect((global.fetch as any).mock.calls[1][1].headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });
});
