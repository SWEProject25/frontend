import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tweetApi } from '../services/tweetApi';
import { TweetResponseDto } from '../types/api';
import { useTweetStore } from '../store/tweetStore';

// Query keys
export const TWEET_QUERY_KEYS = {
  tweetById: (tweetId: number) => ['tweet', 'id', tweetId] as const,
};

// Hook: Get tweet by ID
export const useTweetById = (tweetId: number) => {
  return useQuery<TweetResponseDto, Error>({
    queryKey: TWEET_QUERY_KEYS.tweetById(tweetId),
    queryFn: () => tweetApi.getTweetById(tweetId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
