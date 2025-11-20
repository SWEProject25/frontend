'use clinet';
import {
  InfiniteData,
  QueryClient,
  useQueryClient,
} from '@tanstack/react-query';
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
  type: string
):
  | {
      newFeed: InfiniteData<TimelineFeedDtoResponse, number>;
      newTweet: TimelineFeed;
      oldTweet: TimelineFeed;
    }
  | undefined {
  if (!data) return data;
  const oldTweets = data.pages.flatMap((page) =>
    page.data.posts.filter(
      (post) =>
        post.postId === tweetId &&
        post.isRepost === isRepost &&
        post.isQuote === isQuote
    )
  );
  console.log(oldTweets);
  const oldTweet = oldTweets[0];
  const newTweet = updateTweet(type, oldTweet);
  return {
    newFeed: {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((tweet) =>
            tweet.postId === tweetId &&
            tweet.isRepost === isRepost &&
            tweet.isQuote === isQuote
              ? newTweet
              : tweet
          ),
        },
      })),
    },
    newTweet: newTweet,
    oldTweet: oldTweet,
  };
}

function updateTweet(type: string, tweet: TimelineFeed): TimelineFeed {
  // const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  let updatedTweet = tweet;
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
      console.log(tweet);
      const isLiked = tweet.isLikedByMe;
      const countLikes = tweet.likesCount;
      updatedTweet = {
        ...tweet,
        likesCount: isLiked ? countLikes - 1 : countLikes + 1,
        isLikedByMe: !isLiked,
      };
      // console.log(updatedTweet);
      // setCurrentTweet(updatedTweet);
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPOST:
      const isReposted = tweet.isRepostedByMe;
      const retweetsCount = tweet.retweetsCount;
      updatedTweet = {
        ...tweet,
        retweetsCount: isReposted ? retweetsCount - 1 : retweetsCount + 1,
        isRepostedByMe: !isReposted,
      };
      // console.log(updatedTweet);
      // setCurrentTweet(updatedTweet);

      return updatedTweet;
    case OPTIMISTIC_TYPES.REPLY:
      const commentsCount = tweet.commentsCount;
      updatedTweet = { ...tweet, commentsCount: commentsCount };
      return updatedTweet;
    case OPTIMISTIC_TYPES.FOLLOW:
      const isFollowed = tweet.isFollowedByMe;
      updatedTweet = { ...tweet, isFollowedByMe: !isFollowed };
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

  const onMutate = async (
    tweetId: number,
    isRepost: boolean,
    isQuote: boolean,
    type: string
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
      type
    );
    queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
      queryKey,
      timelineFeed?.newFeed
    );
    console.log(timelineFeed?.newFeed);
    const newTweet = timelineFeed?.newTweet;
    const oldTweet = timelineFeed?.oldTweet;

    return { previousFeed, queryKey, newTweet, oldTweet };
  };

  return { onMutate };
}

export function handleErrorOptimisticTweet(
  queryClient: QueryClient,
  context: {
    previousFeed: InfiniteData<TimelineFeedDtoResponse, number> | undefined;
    queryKey:
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
      | undefined;
    newTweet: TimelineFeed | undefined;
    oldTweet: TimelineFeed | undefined;
  }
) {
  console.log('failure');
  if (context?.previousFeed && context.queryKey) {
    queryClient.setQueryData(context.queryKey, context.previousFeed);
  }
}
