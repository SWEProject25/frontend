'use client';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { tweetApi } from '../services/tweetApi';
import {
  ReplyDto,
  TweetResponseDto,
  LikersResponseDto,
  TweetSummaryDto,
} from '../types/api';
import { useOptimisticTweet } from '@/features/timeline/optimistics/Tweets';
import { OPTIMISTIC_TYPES } from '@/features/timeline/constants/api';
import { tweet } from '@/features/timeline/mocks/data';
import { PROFILE_QUERY_KEYS } from '@/features/profile';
import { useAuth } from '@/features/authentication/hooks';
// Query keys
export const TWEET_QUERY_KEYS = {
  tweetById: (tweetId: number) => ['tweet', 'id', tweetId] as const,
  toggleLikeTweet: (tweetId: number) => ['tweet', 'like', tweetId] as const,
  toggleRepostTweet: (tweetId: number) => ['tweet', 'repost', tweetId] as const,
  getRepliesByTweetId: (tweetId: number) =>
    ['tweet', 'replies', tweetId] as const,
  getTweetSummary: (tweetId: number) => ['tweet', 'summary', tweetId] as const,
  deleteTweet: (tweetId: number) => ['tweet', 'delete', tweetId] as const,
  getLikersByTweetId: (tweetId: number) =>
    ['tweet', 'likers', tweetId] as const,
};

// Hook: Get tweet by ID
export const useTweetById = (tweetId: number) => {
  return useQuery<TweetResponseDto, Error>({
    queryKey: TWEET_QUERY_KEYS.tweetById(tweetId),
    queryFn: () => tweetApi.getTweetById(tweetId),
    staleTime: 0,
    retry: 1,
    refetchOnMount: true,
  });
};

// Hook: Toggle like tweet
export const useToggleLikeTweet = (
  tweetId: number,
  isRepost: boolean,
  isQuote: boolean,
  userId: number,
  parentId?: number,
  type: string = 'POST'
) => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();
  const user = useAuth().user?.id;
  return useMutation({
    mutationFn: () => tweetApi.toggleLikeTweet(tweetId),
    onMutate: () => {
      // Optimistically update cache before mutation
      // queryClient.setQueryData(
      //   TWEET_QUERY_KEYS.tweetById(tweetId),
      //   (old: any) => {
      //     if (!old) return old;
      //     return {
      //       ...old,
      //       data: {
      //         ...old.data,
      //         isLikedByMe: !old.data.isLikedByMe,
      //         likesCount: old.data.isLikedByMe
      //           ? old.data.likesCount - 1
      //           : old.data.likesCount + 1,
      //       },
      //     };
      //   }
      // );
      return onMutate(
        OPTIMISTIC_TYPES.LIKE,
        userId,
        tweetId,
        isRepost,
        type,
        parentId
      );
    },
    onError: (error, variables, onMutateResult) => {
      handleErrorOptimisticTweet(onMutateResult);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleLikeTweet(tweetId),
      });
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.tweetById(tweetId),
      });
      if (user)
        queryClient.invalidateQueries({
          queryKey: PROFILE_QUERY_KEYS.profileLikes(user),
        });
    },
    networkMode: 'always',
  });
};

// Hook: Toggle repost tweet
export const useToggleRepostTweet = (
  tweetId: number,
  isRepost: boolean,
  isQuote: boolean,
  userId: number,
  parentId?: number,
  type: string = 'POST'
) => {
  const queryClient = useQueryClient();
  const { onMutate, handleErrorOptimisticTweet } = useOptimisticTweet();
  const user = useAuth().user?.id;

  return useMutation({
    mutationFn: () => tweetApi.toggleRepostTweet(tweetId),
    onMutate: () => {
      // Optimistically update cache before mutation
      // queryClient.setQueryData(
      //   TWEET_QUERY_KEYS.tweetById(tweetId),
      //   (old: any) => {
      //     if (!old) return old;
      //     return {
      //       ...old,
      //       data: {
      //         ...old.data,
      //         isRepostedByMe: !old.data.isRepostedByMe,
      //         retweetsCount: old.data.isRepostedByMe
      //           ? old.data.retweetsCount - 1
      //           : old.data.retweetsCount + 1,
      //       },
      //     };
      //   }
      // );
      return onMutate(
        OPTIMISTIC_TYPES.REPOST,
        userId,
        tweetId,
        isRepost,
        type,
        parentId
      );
    },
    onError: (error, variables, onMutateResult) => {
      handleErrorOptimisticTweet(onMutateResult);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.toggleRepostTweet(tweetId),
      });
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.tweetById(tweetId),
      });

      if (user) {
        queryClient.invalidateQueries({
          queryKey: PROFILE_QUERY_KEYS.profilePosts(user),
        });
        queryClient.invalidateQueries({
          queryKey: PROFILE_QUERY_KEYS.profileReplies(user),
        });
      }
    },
    networkMode: 'always',
  });
};

export const useGetRepliesByTweetId = (tweetId: number) => {
  return useInfiniteQuery<
    ReplyDto,
    Error,
    InfiniteData<ReplyDto, number>,
    any,
    number
  >({
    queryKey: TWEET_QUERY_KEYS.getRepliesByTweetId(tweetId),
    queryFn: ({ pageParam }) =>
      tweetApi.getRepliesByTweetId(tweetId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.posts.length ? pages.length + 1 : undefined,
    // staleTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 0,
    retry: 1,
  });
};

export const useGetTweetSummary = (tweetId: number) => {
  return useQuery<TweetSummaryDto, Error>({
    queryKey: TWEET_QUERY_KEYS.getTweetSummary(tweetId),
    queryFn: () => tweetApi.getTweetSummary(tweetId),
    staleTime: 0,
    retry: 1,
  });
};
// Hook: Get likers by tweet ID
export const useGetLikersByTweetId = (tweetId: number) => {
  return useInfiniteQuery<
    LikersResponseDto,
    Error,
    InfiniteData<LikersResponseDto, number>,
    any,
    number
  >({
    queryKey: TWEET_QUERY_KEYS.getLikersByTweetId(tweetId),
    queryFn: ({ pageParam }) =>
      tweetApi.getLikersByTweetId(tweetId, pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.data.length >= 10 ? pages.length + 1 : undefined,
    staleTime: 0,
    retry: 1,
  });
};

export const useDeleteTweet = (tweetId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => tweetApi.deleteTweet(tweetId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TWEET_QUERY_KEYS.deleteTweet(tweetId),
      });
    },
    networkMode: 'always',
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
