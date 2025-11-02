'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tweetApi } from '../services/tweetApi';
import { TweetResponseDto } from '../types/api';

// Query keys
export const TWEET_QUERY_KEYS = {
  tweetById: (tweetId: number) => ['tweet', 'id', tweetId] as const,
  toggleLikeTweet: (tweetId: number) => ['tweet', 'like', tweetId] as const,
  toggleRepostTweet: (tweetId: number) => ['tweet', 'repost', tweetId] as const,
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

// Hook: Toggle like tweet
export const useToggleLikeTweet = (tweetId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tweetApi.toggleLikeTweet(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleLikeTweet(tweetId),
      });
    },
  });
};

// Hook: Toggle repost tweet
export const useToggleRepostTweet = (tweetId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tweetApi.toggleRepostTweet(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleRepostTweet(tweetId),
      });
    },
  });
};
