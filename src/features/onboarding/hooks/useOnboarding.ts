import { useMutation, useQuery } from '@tanstack/react-query';
import { onboardingApi } from '../services/onboardingApi';
import {
  UpdateDateOfBirthDto,
  UpdateInterestsDto,
  UpdateDateOfBirthResponseDto,
  UpdateInterestsResponseDto,
  GetSuggestedUsersDto,
  GetSuggestedUsersResponseDto,
  GetInterestsResponseDto,
} from '../types/api';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { authApi } from '@/features/authentication/services/authApi';

// Query keys
export const ONBOARDING_QUERY_KEYS = {
  interests: () => ['onboarding', 'interests'] as const,
  suggestedUsers: (params?: GetSuggestedUsersDto) =>
    ['onboarding', 'suggested-users', params] as const,
};

// Hook: Get all available interests
export const useGetInterests = (enabled = true) => {
  return useQuery<GetInterestsResponseDto, Error>({
    queryKey: ONBOARDING_QUERY_KEYS.interests(),
    queryFn: onboardingApi.getInterests,
    staleTime: 1000 * 60 * 60, // 1 hour - interests don't change often
    enabled, // Only fetch when enabled
  });
};

// Hook: Update date of birth
export const useUpdateDateOfBirth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  return useMutation<UpdateDateOfBirthResponseDto, Error, UpdateDateOfBirthDto>(
    {
      mutationFn: onboardingApi.updateDateOfBirth,
      onSuccess: (data) => {
        // Update the user in auth store with the new date of birth
        if (user) {
          setUser({
            ...user,
            profile: {
              ...user.profile,
              birthDate: data.data.birthDate,
            },
            onboardingStatus: {
              ...user.onboardingStatus,
              hasCompletedBirthDate: true,
              hasCompeletedInterests:
                user.onboardingStatus?.hasCompeletedInterests ?? false,
              hasCompeletedFollowing:
                user.onboardingStatus?.hasCompeletedFollowing ?? false,
            },
          });
        }
        // Clear the cached user to force fresh fetch on next getCurrentUser call
        authApi.clearUserCache();
      },
    }
  );
};

// Hook: Update interests
export const useUpdateInterests = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  return useMutation<UpdateInterestsResponseDto, Error, UpdateInterestsDto>({
    mutationFn: onboardingApi.updateInterests,
    onSuccess: () => {
      // Mark user as having completed interests
      if (user) {
        setUser({
          ...user,
          onboardingStatus: {
            ...user.onboardingStatus,
            hasCompletedBirthDate:
              user.onboardingStatus?.hasCompletedBirthDate ?? false,
            hasCompeletedInterests: true,
            hasCompeletedFollowing:
              user.onboardingStatus?.hasCompeletedFollowing ?? false,
          },
        });
      }
      // Clear the cached user to force fresh fetch on next getCurrentUser call
      authApi.clearUserCache();
    },
  });
};

// Hook: Get suggested users to follow
export const useSuggestedUsers = (
  params?: GetSuggestedUsersDto,
  enabled = true
) => {
  return useQuery<GetSuggestedUsersResponseDto, Error>({
    queryKey: ['onboarding', 'suggested-users', params],
    queryFn: () => onboardingApi.getSuggestedUsers(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled, // Only fetch when enabled
  });
};
