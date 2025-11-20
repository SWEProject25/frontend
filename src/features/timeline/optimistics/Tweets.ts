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

function updateTweetInInfiniteData(
  data: InfiniteData<TimelineFeedDtoResponse, number> | undefined,
  tweetId: number,
  type: string
): InfiniteData<TimelineFeedDtoResponse, number> | undefined {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        posts: page.data.posts.map((tweet) =>
          tweet.postId === tweetId ? useUpdateTweet(type, tweet) : tweet
        ),
      },
    })),
  };
}

function useUpdateTweet(type: string, tweet: TimelineFeed): TimelineFeed {
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
      console.log(tweet);
      const isLiked = tweet.isLikedByMe;
      const countLikes = tweet.likesCount;
      const updatedTweet = {
        ...tweet,
        likesCount: isLiked ? countLikes - 1 : countLikes + 1,
        isLikedByMe: !isLiked,
      };
      console.log(updatedTweet);
      setCurrentTweet(updatedTweet);
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPOST:
      return {
        ...tweet,
        retweetsCount: tweet.isRepostedByMe
          ? tweet.retweetsCount - 1
          : tweet.retweetsCount + 1,
        isRepostedByMe: !tweet.isRepostedByMe,
      };
    case OPTIMISTIC_TYPES.REPLY:
      return {
        ...tweet,
        commentsCount: tweet.commentsCount - 1,
      };
    case OPTIMISTIC_TYPES.FOLLOW:
      return {
        ...tweet,
        isFollowedByMe: !tweet.isFollowedByMe,
      };
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

  const onMutate = async (tweetId: number, type: string) => {
    await queryClient.cancelQueries({ queryKey });
    const previousFeed =
      queryClient.getQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
        queryKey
      );

    queryClient.setQueryData<InfiniteData<TimelineFeedDtoResponse, number>>(
      queryKey,
      (old) => updateTweetInInfiniteData(old, tweetId, type)
    );
    return { previousFeed, queryKey };
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
  }
) {
  if (context?.previousFeed && context.queryKey) {
    queryClient.setQueryData(context.queryKey, context.previousFeed);
  }
}
