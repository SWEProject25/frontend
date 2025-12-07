import { useQuery } from '@tanstack/react-query';
import { fetchSuggestedUsers, SuggestedUser } from '../api/suggestedUsers';

/**
 * Hook to fetch suggested users to follow
 * @param limit - Number of users to retrieve (default: 5)
 * @param enabled - Whether the query should be enabled
 */
export const useSuggestedUsers = (
  limit: number = 5,
  enabled: boolean = true
) => {
  return useQuery<SuggestedUser[], Error>({
    queryKey: ['users', 'suggested', limit],
    queryFn: () => fetchSuggestedUsers(limit, true, true),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
