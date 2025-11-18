import { useGetFollowers, useGetFollowing } from '../userInteractionsQueries';
import { PaginationParams } from '@/types/userInteractions';

/**
 * Hook to fetch followers list
 * @param userId - The user ID to fetch followers for
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useFollowers = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowers(userId, params, enabled);
};

/**
 * Hook to fetch following list
 * @param userId - The user ID to fetch following for
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useFollowing = (
  userId: number,
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetFollowing(userId, params, enabled);
};
