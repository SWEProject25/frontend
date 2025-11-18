import {
  useGetBlockedUsers,
  useGetMutedUsers,
} from '../userInteractionsQueries';
import { PaginationParams } from '@/types/userInteractions';

/**
 * Hook to fetch blocked users list
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useBlockedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetBlockedUsers(params, enabled);
};

/**
 * Hook to fetch muted users list
 * @param params - Pagination parameters
 * @param enabled - Whether the query should be enabled
 */
export const useMutedUsers = (
  params?: PaginationParams,
  enabled: boolean = true
) => {
  return useGetMutedUsers(params, enabled);
};
