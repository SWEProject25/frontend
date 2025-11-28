'use clinet';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import {
  TimelineFeed,
  TimelineFeedDtoResponse,
  TimelineTweet,
} from '../types/api';
import { OPTIMISTIC_TYPES } from '../constants/api';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import { TWEET_QUERY_KEYS } from '@/features/tweets/hooks/tweetQueries';
import { ReplyDto } from '@/features/tweets/types';
import { tweet } from '../mocks/data';
import Timeline from '../components/Timeline';
// import { C } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

function updateTweetInInfiniteData(
  data: InfiniteData<TimelineFeedDtoResponse, number>,
  pages: number[],
  Tweets: TimelineFeed[],
  type: string
):
  | InfiniteData<TimelineFeedDtoResponse, number>
  | InfiniteData<ReplyDto, number> {
  let tweetIndx = 0;
  const maxIndx = Tweets.length - 1;
  if (type === OPTIMISTIC_TYPES.BLOCK || type === OPTIMISTIC_TYPES.MUTE) {
    return {
      ...data,
      pages: data.pages.map((page, pageIndx) => {
        if (pages.includes(pageIndx) && tweetIndx <= maxIndx) {
          return {
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.filter((tweet) => {
                if (tweetIndx <= maxIndx) {
                  if (
                    tweet.postId === Tweets[tweetIndx].postId &&
                    tweet.isRepost === Tweets[tweetIndx].isRepost &&
                    tweet.userId === Tweets[tweetIndx].userId
                  ) {
                    tweetIndx++;
                    return false;
                  } else return true;
                } else return true;
              }),
            },
          };
        } else {
          return page;
        }
      }),
    };
  } else {
    return {
      ...data,
      pages: data.pages.map((page, pageIndx) => {
        if (pages.includes(pageIndx) && tweetIndx <= maxIndx) {
          return {
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((tweet) => {
                if (
                  tweetIndx <= maxIndx &&
                  tweet.postId === Tweets[tweetIndx].postId &&
                  tweet.isRepost === Tweets[tweetIndx].isRepost &&
                  tweet.userId === Tweets[tweetIndx].userId
                ) {
                  return Tweets[tweetIndx++];
                } else return tweet;
              }),
            },
          };
        } else {
          return page;
        }
      }),
    };
  }
}

function updateTweet(
  type: string,
  tweet: TimelineFeed,
  userId: number
): TimelineFeed {
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
      let newTweet: TimelineFeed = tweet;
      let originalPostData: TimelineTweet | undefined = tweet.originalPostData;
      if (tweet.userId === userId)
        newTweet = { ...newTweet, isFollowedByMe: !newTweet.isFollowedByMe };
      if (originalPostData && originalPostData.userId === userId)
        originalPostData = {
          ...originalPostData,
          isFollowedByMe: !originalPostData.isFollowedByMe,
        };
      updatedTweet = { ...newTweet, originalPostData: originalPostData };
      return updatedTweet;

    default:
      return tweet;
  }
}
function handleOldTweets(
  type: string,
  userId: number,
  feed: InfiniteData<TimelineFeedDtoResponse, number>,
  tweetId?: number
): TimelineFeed[] {
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
    case OPTIMISTIC_TYPES.REPOST:
      return feed.pages.flatMap((page) =>
        page.data.posts?.filter((post) => post.postId === tweetId)
      );
    case OPTIMISTIC_TYPES.FOLLOW:
    case OPTIMISTIC_TYPES.BLOCK:
    case OPTIMISTIC_TYPES.MUTE:
      return feed.pages.flatMap((page) =>
        page.data.posts?.filter(
          (post) =>
            post.userId === userId || post.originalPostData?.userId === userId
        )
      );
    default:
      return [];
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
  const currTabQueryKey = useTimelineQueryKey();
  const setCurrentTweet = useTweetStore((state) => state.setCurrentTweet);
  const currentTweet = useTweetStore((state) => state.currentTweet);
  const onMutate = async (
    type: string,
    userId: number,
    tweetId?: number,
    isRepost?: boolean,
    postType: string = 'POST',
    parentId: number = -1
  ): Promise<{
    previousFeeds: {
      queryKey:
        | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
        | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
        | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>;
      previousFeed:
        | InfiniteData<TimelineFeedDtoResponse, number>
        | InfiniteData<ReplyDto, number>
        | undefined;
    }[];
    oldTweet: TimelineFeed | undefined;
  }> => {
    const tabsFeeds: {
      queryKey:
        | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
        | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
        | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>;
      previousFeed:
        | InfiniteData<TimelineFeedDtoResponse, number>
        | InfiniteData<ReplyDto, number>
        | undefined;
    }[] = [];
    let oldTweet: TimelineFeed | undefined;

    const currentKey =
      postType.toLowerCase() === 'reply'
        ? TWEET_QUERY_KEYS.getRepliesByTweetId(parentId)
        : currTabQueryKey;
    const queryKeys: (
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
      | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>
    )[] = [
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
    ].filter((key) => key !== currentKey);
    queryKeys.unshift(currentKey);
    console.log(queryKeys);
    // }
    queryKeys.forEach(async (queryKey) => {
      const result = await optimisticsTabs(
        type,
        userId,
        queryKey,
        tweetId,
        isRepost
      );
      tabsFeeds.push({
        queryKey: queryKey,
        previousFeed: result.previousFeed,
      });
      if (result.oldTweet) oldTweet = result.oldTweet;
    });
    return { previousFeeds: tabsFeeds, oldTweet: oldTweet };
  };

  const optimisticsTabs = async (
    type: string,
    userId: number,
    queryKey:
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
      | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
      | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>,
    tweetId?: number,
    isRepost?: boolean
  ): Promise<{
    previousFeed:
      | InfiniteData<TimelineFeedDtoResponse, number>
      | InfiniteData<ReplyDto, number>
      | undefined;
    oldTweet: TimelineFeed | undefined;
  }> => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed = queryClient.getQueryData<
      | InfiniteData<TimelineFeedDtoResponse, number>
      | InfiniteData<ReplyDto, number>
    >(queryKey);
    let oldTweet: TimelineFeed | undefined;
    if (previousFeed) {
      const oldTweets: TimelineFeed[] = handleOldTweets(
        type,
        userId,
        previousFeed,
        tweetId
      );

      if (oldTweets) {
        const pages: number[] = [];
        oldTweets.forEach((_tweet, indx) => {
          if (!pages.includes(indx)) pages.push(indx);
        });
        console.log(previousFeed);
        let timelineFeed:
          | InfiniteData<TimelineFeedDtoResponse, number>
          | InfiniteData<ReplyDto, number>;
        if (type === OPTIMISTIC_TYPES.BLOCK || type === OPTIMISTIC_TYPES.MUTE) {
          console.log(oldTweets, queryKey, previousFeed);
          timelineFeed = updateTweetInInfiniteData(
            previousFeed,
            pages,
            oldTweets,
            type
          );
          console.log(timelineFeed);
        } else {
          const newTweets: TimelineFeed[] = [];
          oldTweets.forEach((tweet) =>
            newTweets.push(updateTweet(type, tweet, userId))
          );
          timelineFeed = updateTweetInInfiniteData(
            previousFeed,
            pages,
            newTweets,
            type
          );
        }

        queryClient.setQueryData<
          | InfiniteData<TimelineFeedDtoResponse, number>
          | InfiniteData<ReplyDto, number>
        >(queryKey, timelineFeed);
        console.log(timelineFeed);
        if (
          tweetId !== undefined &&
          isRepost !== undefined &&
          currentTweet?.postId === tweetId
        ) {
          oldTweet = oldTweets.find(
            (post) =>
              post.postId === tweetId &&
              post.userId === userId &&
              post.isRepost === isRepost
          );
          if (oldTweet) {
            const newTweet = updateTweet(type, oldTweet, userId);
            console.log('old');
            setCurrentTweet(newTweet);
          } else {
            console.log('old2');
          }
        }
      }
    }
    return { previousFeed, oldTweet };
  };

  function handleErrorOptimisticTweet(
    context:
      | {
          previousFeeds: {
            queryKey:
              | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING
              | typeof TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
              | ReturnType<typeof TWEET_QUERY_KEYS.getRepliesByTweetId>;
            previousFeed:
              | InfiniteData<TimelineFeedDtoResponse, number>
              | undefined;
          }[];
          oldTweet: TimelineFeed | undefined;
        }
      | undefined
  ) {
    console.log(context, 'hi');
    if (context) {
      context.previousFeeds.forEach((feed) => {
        if (feed.previousFeed && feed.queryKey) {
          queryClient.setQueryData(feed.queryKey, feed.previousFeed);
        }
      });
      if (context?.oldTweet) setCurrentTweet(context.oldTweet);
    }
  }
  return { onMutate, handleErrorOptimisticTweet };
}
