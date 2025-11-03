'use client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { tweetApi } from '../services/tweetApi';
import { ReplyResponseDto, TweetResponseDto } from '../types/api';
import { TWEET_CONSTANTS } from '../constants/api';
// Query keys
export const TWEET_QUERY_KEYS = {
  tweetById: (tweetId: number) => ['tweet', 'id', tweetId] as const,
  toggleLikeTweet: (tweetId: number) => ['tweet', 'like', tweetId] as const,
  toggleRepostTweet: (tweetId: number) => ['tweet', 'repost', tweetId] as const,
  getRepliesByTweetId: (tweetId: number) =>
    ['tweet', 'replies', tweetId] as const,
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

export const useGetRepliesByTweetId = (tweetId: number) => {
  return useQuery<ReplyResponseDto, Error>({
    queryKey: TWEET_QUERY_KEYS.getRepliesByTweetId(tweetId),
    queryFn: () => tweetApi.getRepliesByTweetId(tweetId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook: Get replies by tweet ID
// export const useGetRepliesByTweetId = (tweetId: number) => {
//   return useInfiniteQuery<
//     ReplyResponseDto,
//     Error,
//     InfiniteData<ReplyResponseDto, number>,
//     number
//   >({
//     queryKey: TWEET_QUERY_KEYS.getRepliesByTweetId(tweetId),
//     queryFn: ({ pageParam }) =>
//       tweetApi.getRepliesByTweetId(tweetId, pageParam),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage, pages) =>
//       lastPage.data.replies.length === TWEET_CONSTANTS.DEFAULT_LIMIT
//         ? pages.length + 1
//         : undefined,

//     staleTime: 5 * 60 * 1000, // 5 minutes
//     retry: 1,
//   });
// };
