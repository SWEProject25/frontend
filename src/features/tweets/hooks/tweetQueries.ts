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
import {
  handleErrorOptimisticTweet,
  useOptimisticTweet,
} from '@/features/timeline/optimistics/Tweets';
import { useTweetStore } from '../store/tweetStore';
import { OPTIMISTIC_TYPES } from '@/features/timeline/constants/api';
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
export const useToggleLikeTweet = (
  tweetId: number,
  isRepost: boolean,
  isQuote: boolean
) => {
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const queryClient = useQueryClient();
  const { onMutate } = useOptimisticTweet();
  return useMutation({
    mutationFn: () => tweetApi.toggleLikeTweet(tweetId),
    onMutate: () => {
      return onMutate(tweetId, isRepost, isQuote, OPTIMISTIC_TYPES.LIKE);
    },
    onError: (error, variables, onMutateResult) => {
      if (onMutateResult?.previousFeed) {
        handleErrorOptimisticTweet(queryClient, onMutateResult);
      }
      if (onMutateResult?.oldTweet) setCurrentTweet(onMutateResult.oldTweet);
    },

    onSuccess: (data, variables, onMutateResult) => {
      if (onMutateResult?.newTweet) setCurrentTweet(onMutateResult.newTweet);
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleLikeTweet(tweetId),
      });
    },
  });
};

// Hook: Toggle repost tweet
export const useToggleRepostTweet = (
  tweetId: number,
  isRepost: boolean,
  isQuote: boolean
) => {
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const currentFullTweet = useTweetStore((store) => store.currentTweet);
  const queryClient = useQueryClient();
  const { onMutate } = useOptimisticTweet();

  return useMutation({
    mutationFn: () => tweetApi.toggleRepostTweet(tweetId),
    onMutate: () =>
      onMutate(tweetId, isRepost, isQuote, OPTIMISTIC_TYPES.REPOST),
    onError: (error, variables, onMutateResult) => {
      if (onMutateResult?.oldTweet) setCurrentTweet(onMutateResult.oldTweet);
      if (onMutateResult?.previousFeed)
        handleErrorOptimisticTweet(queryClient, onMutateResult);
    },
    onSuccess: (data, variables, onMutateResult) => {
      if (onMutateResult?.newTweet) setCurrentTweet(onMutateResult.newTweet);
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleRepostTweet(tweetId),
      });
    },
  });
};

export const useGetRepliesByTweetId = (
  tweetId: number
  // isRepost: number,
  // isQuote: number
) => {
  return useInfiniteQuery<
    ReplyResponseDto,
    Error,
    InfiniteData<ReplyResponseDto, number>,
    any,
    number
  >({
    queryKey: TWEET_QUERY_KEYS.getRepliesByTweetId(tweetId),
    queryFn: ({ pageParam }) =>
      tweetApi.getRepliesByTweetId(tweetId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length ? pages.length + 1 : undefined,
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
