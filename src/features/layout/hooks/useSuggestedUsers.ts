import { useQuery } from '@tanstack/react-query';
import { layoutApi } from '../services/layoutApi';
import { SuggestedUsersResponseDto } from '../types/api';
import { LAYOUT_QUERY_KEYS } from './queryKeys';
import { LAYOUT_CONSTANTS } from '../constants/api';

/**
 * Hook to fetch suggested users to follow
 * @param limit - Number of users to retrieve (default: 5)
 * @param enabled - Whether the query should be enabled
 */
export const useSuggestedUsers = (
  limit: number = LAYOUT_CONSTANTS.DEFAULT_SUGGESTED_USERS_LIMIT,
  enabled: boolean = true
) => {
  return useQuery<SuggestedUsersResponseDto, Error>({
    queryKey: LAYOUT_QUERY_KEYS.suggestedUsers(limit),
    queryFn: () => layoutApi.getSuggestedUsers(limit, true, true),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
