import { useQuery } from '@tanstack/react-query';
import {
  getConversationUnseenCount,
  getTotalUnseenCount,
} from '../api/messages';

/**
 * Hook to get the unseen message count for a specific conversation
 * @param conversationId - The ID of the conversation
 * @param enabled - Whether the query should be enabled
 */
export const useConversationUnseenCount = (
  conversationId: number | null | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['messages', 'unseen', conversationId],
    queryFn: () => getConversationUnseenCount(conversationId!),
    enabled: enabled && !!conversationId,
    staleTime: 10 * 1000, // 10 seconds - more aggressive to catch updates quickly
    refetchInterval: 30 * 1000, // Refetch every 30 seconds (matches notification polling)
    retry: 1,
  });
};

/**
 * Hook to get the total unseen message count across all conversations
 * @param enabled - Whether the query should be enabled
 *
 * This hook fetches the total count from the backend API.
 * It refetches regularly to ensure the badge count is accurate.
 */
export const useTotalUnseenCount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['messages', 'unseen', 'total'],
    queryFn: getTotalUnseenCount,
    enabled,
    staleTime: 10 * 1000, // 10 seconds - more aggressive
    refetchInterval: 30 * 1000, // Refetch every 30 seconds (matches notification polling)
    retry: 1,
  });
};
