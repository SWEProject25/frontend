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
import { TIMELINE_QUERY_KEYS } from '@/features/timeline/hooks/timelineQueries';
import { TimelineFeedDtoResponse } from '@/features/timeline/types/api';
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
export const useToggleLikeTweet = (tweetId: number) => {
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const currentFullTweet = useTweetStore((store) => store.currentTweet);
  const queryClient = useQueryClient();
  const { onMutate } = useOptimisticTweet();
  return useMutation({
    mutationFn: () => tweetApi.toggleLikeTweet(tweetId),
    onMutate: () => onMutate(tweetId, OPTIMISTIC_TYPES.LIKE),
    onError(error, variables, onMutateResult) {
      if (onMutateResult)
        handleErrorOptimisticTweet(queryClient, onMutateResult);
    },

    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleLikeTweet(tweetId),
      });

      if (onMutateResult) {
        // console.log('on mutate', onMutateResult);
        const newTweets = onMutateResult.previousFeed?.pages
          .flatMap((page) => page.data.posts)
          .filter((tweet) => tweet.postId === tweetId);

        console.log('new tweets', newTweets);
        if (newTweets && newTweets.length > 0) {
          const originalTweet = newTweets[0];
          // console.log('newTweet', originalTweet);

          const isLiked = originalTweet.isLikedByMe;
          const countLikes = originalTweet.likesCount;

          // ✅ Create a new object instead of mutating
          const updatedTweet = {
            ...originalTweet,
            likesCount: isLiked ? countLikes - 1 : countLikes + 1,
            isLikedByMe: !isLiked,
          };

          // console.log('updated tweet', updatedTweet.postId);
          // console.log('currentFullTweet', currentFullTweet);
          if (updatedTweet.postId === currentFullTweet?.postId) {
            // console.log('setting current tweet', updatedTweet);
            setCurrentTweet(updatedTweet);
          }
        }
      }
    },
  });
};

// Hook: Toggle repost tweet
export const useToggleRepostTweet = (tweetId: number) => {
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const currentFullTweet = useTweetStore((store) => store.currentTweet);
  const queryClient = useQueryClient();
  const { onMutate } = useOptimisticTweet();

  return useMutation({
    mutationFn: () => tweetApi.toggleRepostTweet(tweetId),
    onMutate: () => onMutate(tweetId, OPTIMISTIC_TYPES.REPOST),
    onError(error, variables, onMutateResult) {
      if (onMutateResult)
        handleErrorOptimisticTweet(queryClient, onMutateResult);
    },
    onSuccess: (data, variables, onMutateResult) => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleRepostTweet(tweetId),
      });

      if (onMutateResult) {
        const newTweets = onMutateResult.previousFeed?.pages
          .flatMap((page) => page.data.posts)
          .filter((tweet) => tweet.postId === tweetId);

        if (newTweets && newTweets.length > 0) {
          const originalTweet = newTweets[0];
          const isReposted = originalTweet.isRepostedByMe;
          const countReposts = originalTweet.retweetsCount;

          // ✅ Create a new object instead of mutating
          const updatedTweet = {
            ...originalTweet,
            retweetsCount: isReposted ? countReposts - 1 : countReposts + 1,
            isRepostedByMe: !isReposted,
          };

          if (updatedTweet.postId === currentFullTweet?.postId) {
            setCurrentTweet(updatedTweet);
          }
        }
      }
    },
  });
};

export const useGetRepliesByTweetId = (tweetId: number) => {
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
