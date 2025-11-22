import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';
import {
  UpdateProfileDto,
  SearchProfilesParams,
  ProfileResponseDto,
  ProfileSearchResponseDto,
} from '../types/api';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '@/features/authentication/store/authStore';

// Query keys
export const PROFILE_QUERY_KEYS = {
  myProfile: ['profile', 'me'] as const,
  profileByUserId: (userId: number) => ['profile', 'user', userId] as const,
  profileByUsername: (username: string) =>
    ['profile', 'username', username] as const,
  searchProfiles: (params: SearchProfilesParams) =>
    ['profile', 'search', params] as const,
};

// Hook: Get current user's profile
export const useMyProfile = () => {
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.myProfile,
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getMyProfile();
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

// Hook: Update current user's profile
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, UpdateProfileDto>({
    mutationFn: async (profileData: UpdateProfileDto) => {
      setLoading(true);
      try {
        const response = await profileApi.updateMyProfile(profileData);
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
      const profileImageUrl = data.data.profile_image_url;

      // Update auth store user with new profile image if it changed
      if (profileImageUrl !== undefined) {
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setUser({
            ...currentUser,
            profile: {
              ...currentUser.profile,
              profileImageUrl: profileImageUrl,
            },
          });
        }

        // Update auth store cache in React Query
        queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
          if (!oldUser) return oldUser;
          return {
            ...oldUser,
            profile: {
              ...oldUser.profile,
              profileImageUrl: profileImageUrl,
            },
          };
        });
      }

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Upload profile image (multipart)
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, File>({
    mutationFn: async (file: File) => {
      setLoading(true);
      try {
        const response = await profileApi.uploadProfileImage(file);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      const profileImageUrl = data.data.profile_image_url;

      // Update auth store user with new profile image
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          profile: {
            ...currentUser.profile,
            profileImageUrl: profileImageUrl,
          },
        });
      }

      // Update auth store cache in React Query
      queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          profile: {
            ...oldUser.profile,
            profileImageUrl: profileImageUrl,
          },
        };
      });

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Upload banner image (multipart)
export const useUploadBannerImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, File>({
    mutationFn: async (file: File) => {
      setLoading(true);
      try {
        const response = await profileApi.uploadBannerImage(file);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Remove profile image
export const useRemoveProfileImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, void>({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.removeProfileImage();
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      // Update auth store user with null profile image
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          profile: {
            ...currentUser.profile,
            profileImageUrl: null,
          },
        });
      }

      // Update auth store cache in React Query
      queryClient.setQueryData(['auth', 'user'], (oldUser: any) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          profile: {
            ...oldUser.profile,
            profileImageUrl: null,
          },
        };
      });

      // Invalidate profile queries to refetch
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Remove banner image
export const useRemoveBannerImage = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useProfileStore();

  return useMutation<ProfileResponseDto, Error, void>({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.removeBannerImage();
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to remove image';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
};

// Hook: Get profile by user ID
export const useProfileByUserId = (userId: number, enabled: boolean = true) => {
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.profileByUserId(userId),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getProfileByUserId(userId);
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
    enabled: enabled && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Get profile by username
export const useProfileByUsername = (
  username: string,
  enabled: boolean = true
) => {
  const { setCurrentProfile, setLoading, setError } = useProfileStore();

  return useQuery<ProfileResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.profileByUsername(username),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.getProfileByUsername(username);
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
    enabled: enabled && username.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Search profiles
export const useSearchProfiles = (
  params: SearchProfilesParams,
  enabled: boolean = true
) => {
  const { setLoading, setError } = useProfileStore();

  return useQuery<ProfileSearchResponseDto, Error>({
    queryKey: PROFILE_QUERY_KEYS.searchProfiles(params),
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await profileApi.searchProfiles(params);
        setError(null);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to search profiles';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: enabled && params.query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};
