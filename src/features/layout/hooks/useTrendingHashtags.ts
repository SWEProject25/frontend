import { useQuery } from '@tanstack/react-query';
import { layoutApi } from '../services/layoutApi';
import { TrendingHashtagsResponseDto } from '../types/api';
import { LAYOUT_QUERY_KEYS } from './queryKeys';
import { LAYOUT_CONSTANTS } from '../constants/api';

/**
 * Hook to fetch trending hashtags
 * @param limit - Number of hashtags to retrieve (default: 10)
 * @param enabled - Whether the query should be enabled
 */
export const useTrendingHashtags = (
  limit: number = LAYOUT_CONSTANTS.DEFAULT_TRENDING_HASHTAGS_LIMIT,
  enabled: boolean = true
) => {
  return useQuery<TrendingHashtagsResponseDto, Error>({
    queryKey: LAYOUT_QUERY_KEYS.trendingHashtags(limit),
    queryFn: () => layoutApi.getTrendingHashtags(limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
