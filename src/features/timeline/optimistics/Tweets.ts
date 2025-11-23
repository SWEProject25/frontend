'use clinet';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import { TimelineFeed, TimelineFeedDtoResponse } from '../types/api';
import { OPTIMISTIC_TYPES } from '../constants/api';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
// import { C } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

function updateTweetInInfiniteData(
  data: InfiniteData<TimelineFeedDtoResponse, number> | undefined,
  tweetId: number,
  isRepost: boolean,
  isQuote: boolean,
  userId: number,
  type: string
):
  | {
      newFeed: InfiniteData<TimelineFeedDtoResponse, number>;
      newTweet: TimelineFeed;
      oldTweet: TimelineFeed;
    }
  | undefined {
  if (!data) return data;
  let postIndex = 0;
  const pageIndex = data.pages.findIndex((page) =>
    page.data.posts.find((post, indx) => {
      if (
        post.postId === tweetId &&
        post.isRepost === isRepost &&
        post.isQuote === isQuote &&
        post.userId === userId
      ) {
        postIndex = indx;
        return true;
      } else return false;
    })
  );
  const old = data.pages[pageIndex].data.posts[postIndex];
  const newTweet = updateTweet(type, old);
  return {
    newFeed: {
      ...data,
      pages: data.pages.map((page, PIndx) => {
        if (PIndx !== pageIndex) return page;
        else
          return {
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((tweet, tweetIndex) => {
                if (tweetIndex !== postIndex) return tweet;
                else return newTweet;
              }),
            },
          };
      }),
    },
    newTweet: newTweet,
    oldTweet: old,
  };
}

function updateTweet(type: string, tweet: TimelineFeed): TimelineFeed {
  let updatedTweet = tweet;
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
      updatedTweet = {
        ...tweet,
        likesCount: tweet.isLikedByMe
          ? tweet.likesCount - 1
          : tweet.likesCount + 1,
        isLikedByMe: !tweet.isLikedByMe,
      };
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPOST:
      updatedTweet = {
        ...tweet,
        retweetsCount: tweet.isRepostedByMe
          ? tweet.retweetsCount - 1
          : tweet.retweetsCount + 1,
        isRepostedByMe: !tweet.isRepostedByMe,
      };
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPLY:
      updatedTweet = { ...tweet, commentsCount: tweet.commentsCount + 1 };
      return updatedTweet;

    case OPTIMISTIC_TYPES.FOLLOW:
      updatedTweet = { ...tweet, isFollowedByMe: !tweet.isFollowedByMe };
      return updatedTweet;

    default:
      return tweet;
  }
}

export function useTimelineQueryKey() {
  const selectedTab = useSelectedTab();
  if (selectedTab === FOLLOWING_TAB)
    return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;

  return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU;
}
export function useOptimisticTweet() {
  const queryClient = useQueryClient();
  const queryKey = useTimelineQueryKey();
  const setCurrentTweet = useTweetStore((state) => state.setCurrentTweet);
  const onMutate = async (
    type: string,
    tweetId: number,
    isRepost: boolean,
    isQuote: boolean,
    userId: number
  ) => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed =
      queryClient.getQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
        queryKey
      );
    console.log(previousFeed);
    const timelineFeed = updateTweetInInfiniteData(
      previousFeed,
      tweetId,
      isRepost,
      isQuote,
      userId,
      type
    );
    queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
      queryKey,
      timelineFeed?.newFeed
    );
    console.log(timelineFeed?.newFeed);
    const newTweet = timelineFeed?.newTweet ?? null;
    const oldTweet = timelineFeed?.oldTweet ?? null;
    setCurrentTweet(newTweet);

    return { previousFeed, queryKey, oldTweet };
  };
  function handleErrorOptimisticTweet(context: {
    previousFeed: InfiniteData<TimelineFeedDtoResponse, number> | undefined;
    queryKey:
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
      | undefined;
    oldTweet: TimelineFeed | null;
  }) {
    if (context?.previousFeed && context.queryKey) {
      queryClient.setQueryData(context.queryKey, context.previousFeed);
    }
    setCurrentTweet(context.oldTweet);
  }
  return { onMutate, handleErrorOptimisticTweet };
}
