import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockProfileApi } from './mockProfileApi';
import {
  UpdateProfileDto,
  SearchProfilesParams,
  ProfileResponseDto,
  ProfileSearchResponseDto,
} from '../types/api';
import { useProfileStore } from '../store/profileStore';

/**
 * Mock Profile Hooks using TanStack Query
 * These hooks use the mock API instead of the real API
 * Perfect for development and testing without a backend
 */

// Query keys (same as real implementation)
export const MOCK_PROFILE_QUERY_KEYS = {
  myProfile: ['profile', 'me', 'mock'] as const,
  profileByUserId: (userId: number) =>
    ['profile', 'user', userId, 'mock'] as const,
  profileByUsername: (username: string) =>
    ['profile', 'username', username, 'mock'] as const,
  searchProfiles: (params: SearchProfilesParams) =>
    ['profile', 'search', params, 'mock'] as const,
  allProfiles: ['profile', 'all', 'mock'] as const,
};

// Hook: Get current user's profile (MOCK)
export const useMockMyProfile = () => {
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: MOCK_PROFILE_QUERY_KEYS.myProfile,
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await mockProfileApi.getMyProfile();
        setCurrentProfile(response.data);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Update current user's profile (MOCK)
export const useMockUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, UpdateProfileDto>({
    mutationFn: async (profileData: UpdateProfileDto) => {
      setLoading(true);
      try {
        const response = await mockProfileApi.updateMyProfile(profileData);
        setCurrentProfile(response.data);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update profile';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({
        queryKey: MOCK_PROFILE_QUERY_KEYS.myProfile,
      });
      // Also invalidate by username if available
      if (data.data.User.username) {
        queryClient.invalidateQueries({
          queryKey: MOCK_PROFILE_QUERY_KEYS.profileByUsername(
            data.data.User.username
          ),
        });
      }
    },
  });
};

// Hook: Get profile by user ID (MOCK)
export const useMockProfileByUserId = (
  userId: number,
  enabled: boolean = true
) => {
  return useQuery<ProfileResponseDto, Error>({
    queryKey: MOCK_PROFILE_QUERY_KEYS.profileByUserId(userId),
    queryFn: () => mockProfileApi.getProfileByUserId(userId),
    enabled: enabled && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Get profile by username (MOCK)
export const useMockProfileByUsername = (
  username: string,
  enabled: boolean = true
) => {
  return useQuery<ProfileResponseDto, Error>({
    queryKey: MOCK_PROFILE_QUERY_KEYS.profileByUsername(username),
    queryFn: () => mockProfileApi.getProfileByUsername(username),
    enabled: enabled && username.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Search profiles (MOCK)
export const useMockSearchProfiles = (
  params: SearchProfilesParams,
  enabled: boolean = true
) => {
  return useQuery<ProfileSearchResponseDto, Error>({
    queryKey: MOCK_PROFILE_QUERY_KEYS.searchProfiles(params),
    queryFn: () => mockProfileApi.searchProfiles(params),
    enabled: enabled && params.query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

// Hook: Get all profiles (MOCK) - Useful for testing
export const useMockAllProfiles = (enabled: boolean = true) => {
  return useQuery<ProfileSearchResponseDto, Error>({
    queryKey: MOCK_PROFILE_QUERY_KEYS.allProfiles,
    queryFn: () => mockProfileApi.getAllProfiles(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};
