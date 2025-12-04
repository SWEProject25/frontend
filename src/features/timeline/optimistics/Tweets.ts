'use client';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import {
  FeedType,
  QueryKeyType,
  TimelineFeed,
  TimelineFeedDtoResponse,
  TimelineTweet,
} from '../types/api';
import { OPTIMISTIC_TYPES } from '../constants/api';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import { TWEET_QUERY_KEYS } from '@/features/tweets/hooks/tweetQueries';
import { ReplyDto } from '@/features/tweets/types';
import { usePathname, useRouter } from 'next/navigation';
import { tweet } from '../mocks/data';
import { EXPLORE_QUERY_KEYS } from '@/features/explore/hooks/exploreQueries';
import { ExploreSearchFeedDtoResponse } from '@/features/explore/types/api';
import {
  useSearch,
  useSelectedSearchTab,
  useSelectedTab as useExploreSelectedTab,
} from '@/features/explore/store/useExploreStore';
import {
  FOR_YOU_TAB,
  TOP_TAB,
  TRENDING_TAB,
} from '@/features/explore/constants/tabs';

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

    case OPTIMISTIC_TYPES.BLOCK:
    case OPTIMISTIC_TYPES.MUTE:
      // happens in updateTweetInInfiniteData with shouldRemove flag
      return tweet;

    default:
      return tweet;
  }
}
function handleOldTweets(
  type: string,
  userId: number,
  feed: InfiniteData<TimelineFeedDtoResponse, number>,
  tweetId?: number
): { oldTweets: TimelineFeed[] | undefined; pages: number[] } {
  const pages: number[] = [];
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
    case OPTIMISTIC_TYPES.REPOST:
      const oldTweets = feed.pages.flatMap((page, indx) =>
        page.data.posts?.filter((post) => {
          if (post.postId === tweetId) {
            if (!pages.includes(indx)) pages.push(indx);
            return true;
          } else return false;
        })
      );
      return { oldTweets, pages };
    case OPTIMISTIC_TYPES.FOLLOW:
    case OPTIMISTIC_TYPES.BLOCK:
    case OPTIMISTIC_TYPES.MUTE:
      const tweets = feed.pages.flatMap((page, indx) =>
        page.data.posts?.filter((post) => {
          if (
            post.userId === userId ||
            post.originalPostData?.userId === userId
          ) {
            if (!pages.includes(indx)) pages.push(indx);
            return true;
          } else return false;
        })
      );
      return { oldTweets: tweets, pages };

    default:
      return { oldTweets: undefined, pages };
  }
}

export function useTimelineQueryKey() {
  const selectedTab = useSelectedTab();
  if (selectedTab === FOLLOWING_TAB)
    return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;

  return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU;
}

export function useExploreQueryKey() {
  const selectedSearchTab = useSelectedSearchTab();
  const selectedTab = useExploreSelectedTab();
  const search = useSearch();
  if (!search) {
    if (selectedTab === FOR_YOU_TAB) {
      return EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;
    } else return EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;
  } else if (selectedSearchTab === TOP_TAB)
    return EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP(search);
  else return EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST(search);
}

export function useOptimisticTweet() {
  const queryClient = useQueryClient();
  const currTabQueryKey = useTimelineQueryKey();
  const currExploreTabQueryKey = useExploreQueryKey();
  const setCurrentTweet = useTweetStore((state) => state.setCurrentTweet);
  const currentTweet = useTweetStore((state) => state.currentTweet);
  const search = useSearch();
  const path = usePathname();
  const isHome = path?.startsWith('/home');
  const router = useRouter();
  const onMutate = async (
    type: string,
    userId: number,
    tweetId?: number,
    isRepost?: boolean,
    postType: string = 'POST',
    parentId: number = -1
  ): Promise<{
    previousFeeds: {
      queryKey: QueryKeyType;
      previousFeed: FeedType | undefined;
    }[];
    oldTweet: TimelineFeed | undefined;
  }> => {
    const tabsFeeds: {
      queryKey: QueryKeyType;
      previousFeed: FeedType | undefined;
    }[] = [];
    let oldTweet: TimelineFeed | undefined;

    const currentKey = !isHome
      ? currExploreTabQueryKey
      : postType.toLowerCase() === 'reply'
        ? TWEET_QUERY_KEYS.getRepliesByTweetId(parentId)
        : currTabQueryKey;
    const queryKeys: QueryKeyType[] = [
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU,
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST(search),
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP(search),
    ].filter((key) => JSON.stringify(key) !== JSON.stringify(currentKey));
    queryKeys.unshift(currentKey);
    console.log(queryKeys);
    // }
    for (const queryKey of queryKeys) {
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
    }
    // queryKeys.forEach(async (queryKey) => {
    //   const result = await optimisticsTabs(
    //     type,
    //     userId,
    //     queryKey,
    //     tweetId,
    //     isRepost
    //   );
    //   tabsFeeds.push({
    //     queryKey: queryKey,
    //     previousFeed: result.previousFeed,
    //   });
    //   if (result.oldTweet) oldTweet = result.oldTweet;
    // });
    return { previousFeeds: tabsFeeds, oldTweet: oldTweet };
  };

  const optimisticsTabs = async (
    type: string,
    userId: number,
    queryKey: QueryKeyType,
    tweetId?: number,
    isRepost?: boolean
  ): Promise<{
    previousFeed: FeedType | undefined;
    oldTweet: TimelineFeed | undefined;
  }> => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed = queryClient.getQueryData<FeedType>(queryKey);
    let oldTweet: TimelineFeed | undefined;
    if (previousFeed) {
      const { oldTweets, pages } = handleOldTweets(
        type,
        userId,
        previousFeed,
        tweetId
      );

      if (oldTweets) {
        console.log(previousFeed);
        let timelineFeed: FeedType;
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
          oldTweets.forEach((tweet) => {
            newTweets.push(updateTweet(type, tweet, userId));
            console.log(tweet, queryKey);
          });
          console.log(newTweets);
          timelineFeed = updateTweetInInfiniteData(
            previousFeed,
            pages,
            newTweets,
            type
          );
        }

        queryClient.setQueryData<FeedType>(queryKey, timelineFeed);
        console.log(timelineFeed);

        if (type === OPTIMISTIC_TYPES.BLOCK || type === OPTIMISTIC_TYPES.MUTE) {
          if (
            currentTweet &&
            (currentTweet.userId === userId ||
              currentTweet.originalPostData?.userId === userId)
          ) {
            router.push('/home');
            setCurrentTweet(null);
          }
        } else {
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
    }
    return { previousFeed, oldTweet };
  };

  function handleErrorOptimisticTweet(
    context:
      | {
          previousFeeds: {
            queryKey: QueryKeyType;
            previousFeed: FeedType | undefined;
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
