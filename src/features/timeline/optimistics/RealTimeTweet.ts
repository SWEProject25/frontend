'use client';
import { useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import { FeedType, QueryKeyType, TimelineFeed } from '../types/api';
import { OPTIMISTIC_TYPES } from '../constants/api';
import { TWEET_QUERY_KEYS } from '@/features/tweets/hooks/tweetQueries';
import { usePathname } from 'next/navigation';
import { EXPLORE_QUERY_KEYS } from '@/features/explore/hooks/exploreQueries';
import { ExplorePersonalizedFeedDtoResponse } from '@/features/explore/types/api';
import {
  useSearch,
  useSelectedSearchTab,
  useInterest,
  useSelectedInterestTab,
} from '@/features/explore/store/useExploreStore';
import { useSelectedTab as useProfileSelectedTab } from '@/features/profile/store/profileStore';
import { LATEST_TAB, TOP_TAB } from '@/features/explore/constants/tabs';
import { PROFILE_QUERY_KEYS, useProfileStore } from '@/features/profile';
import { useAuth } from '@/features/authentication/hooks';
import {
  LIKES_TAB,
  MEDIA_TAB,
  MENTIONS_TAB,
  POSTS_TAB,
  REPLIES_TAB,
} from '@/features/profile/constants/tabs';

function updateTweetInInfiniteData(
  data: FeedType,
  pages: number[],
  Tweets: TimelineFeed[]
): FeedType {
  let tweetIndx = 0;
  const maxIndx = Tweets.length - 1;
  return {
    ...data,
    pages: data.pages.map((page, pageIndx) => {
      if (pages.includes(pageIndx) && tweetIndx <= maxIndx) {
        return {
          ...page,
          data: {
            ...page.data,
            posts: page.data.posts.map((tweet) => {
              if (tweetIndx <= maxIndx) {
                const tweetId = tweet.postId ?? tweet.originalPostData?.postId;
                const newTweetId =
                  Tweets[tweetIndx].postId ??
                  Tweets[tweetIndx].originalPostData?.postId;
                if (
                  tweetId === newTweetId &&
                  tweet.isRepost === Tweets[tweetIndx].isRepost &&
                  tweet.userId === Tweets[tweetIndx].userId
                ) {
                  return Tweets[tweetIndx++];
                } else return tweet;
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

function updateTweetPersonalizedInterestsData(
  data: ExplorePersonalizedFeedDtoResponse,
  pages: string[],
  Tweets: TimelineFeed[]
): ExplorePersonalizedFeedDtoResponse {
  let tweetIndx = 0;
  const maxIndx = Tweets.length - 1;
  const newFeed = Object.keys(data.data).reduce(
    (acc, category) => {
      if (!pages.includes(category)) acc[category] = data.data[category];
      else
        acc[category] = data.data[category].map((tweet) => {
          if (tweetIndx <= maxIndx) {
            const tweetId = tweet.postId ?? tweet.originalPostData?.postId;
            const newTweetId =
              Tweets[tweetIndx].postId ??
              Tweets[tweetIndx].originalPostData?.postId;
            if (
              tweetId === newTweetId &&
              tweet.isRepost === Tweets[tweetIndx].isRepost &&
              tweet.userId === Tweets[tweetIndx].userId
            ) {
              return Tweets[tweetIndx++];
            } else return tweet;
          } else return tweet;
        });
      return acc;
    },
    {} as Record<string, TimelineFeed[]>
  );
  return { ...data, data: newFeed };
}

function updateTweet(
  type: string,
  tweet: TimelineFeed,
  count: number
): TimelineFeed {
  let updatedTweet = tweet;
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            likesCount: count,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else {
        updatedTweet = {
          ...tweet,
          likesCount: count,
        };
      }
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPOST:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            retweetsCount: count,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else
        updatedTweet = {
          ...tweet,
          retweetsCount: count,
        };
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPLY:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            commentsCount: count,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else updatedTweet = { ...tweet, commentsCount: count };
      return updatedTweet;

    default:
      return tweet;
  }
}
function handleOldTweets(
  userId: number,
  feed: FeedType,
  tweetId: number
): { oldTweets: TimelineFeed[] | undefined; pages: number[] } {
  const pages: number[] = [];
  try {
    const oldTweets = feed.pages.flatMap((page, indx) =>
      page.data.posts?.filter((post) => {
        if (post.isRepost && post.originalPostData) {
          if (post.originalPostData.postId === tweetId) {
            if (!pages.includes(indx)) pages.push(indx);
            return true;
          } else return false;
        } else {
          if (post.postId === tweetId) {
            if (!pages.includes(indx)) pages.push(indx);
            return true;
          } else return false;
        }
      })
    );
    return { oldTweets, pages };
  } catch {
    return { oldTweets: undefined, pages: [] };
  }
}

function handleOldInterestsTweets(
  userId: number,
  feed: ExplorePersonalizedFeedDtoResponse,
  tweetId: number
): { oldTweets: TimelineFeed[] | undefined; pages: string[] } {
  const pages: string[] = [];
  const oldTweets: TimelineFeed[] = [];
  try {
    Object.keys(feed.data).map((category) =>
      feed.data[category].forEach((post, i) => {
        if (post.isRepost && post.originalPostData) {
          if (
            post.originalPostData.postId === tweetId
            // &&
            // post.userId === userId
          ) {
            if (!pages.includes(category)) pages.push(category);
            oldTweets.push(feed.data[category][i]);
          }
        } else {
          if (post.postId === tweetId) {
            if (!pages.includes(category)) pages.push(category);
            oldTweets.push(feed.data[category][i]);
          }
        }
      })
    );

    return { oldTweets, pages };
  } catch {
    return { oldTweets: undefined, pages: [] };
  }
}

export function useTimelineQueryKey() {
  const selectedTab = useSelectedTab();
  if (selectedTab === FOLLOWING_TAB)
    return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;

  return TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU;
}

export function useProfileQueryKey() {
  const profile = useProfileStore((state) => state.currentProfile)?.User;
  const myProfile = useAuth().user;
  const user = profile?.id ?? myProfile?.id ?? -1;
  const selectedTab = useProfileSelectedTab();
  switch (selectedTab) {
    case POSTS_TAB:
      return PROFILE_QUERY_KEYS.profilePosts(user);
    case REPLIES_TAB:
      return PROFILE_QUERY_KEYS.profileReplies(user);

    case LIKES_TAB:
      return PROFILE_QUERY_KEYS.profileLikes(user);

    case MENTIONS_TAB:
      return PROFILE_QUERY_KEYS.profileMentions(user);

    case MEDIA_TAB:
      return PROFILE_QUERY_KEYS.profileMedia(user);
    default:
      return PROFILE_QUERY_KEYS.profilePosts(user);
  }
}

export function useExploreQueryKey() {
  const selectedSearchTab = useSelectedSearchTab();
  const search = useSearch();
  if (!search) {
    return EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU;
  } else if (selectedSearchTab === TOP_TAB)
    return EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP(search);
  else return EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST(search);
}

export function useInterestQueryKey() {
  const selectedTab = useSelectedInterestTab();
  const interest = useInterest();
  return EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST(interest, selectedTab);
}

export function useRealTimeTweet() {
  const queryClient = useQueryClient();
  const currTabQueryKey = useTimelineQueryKey();
  const currExploreTabQueryKey = useExploreQueryKey();
  const currInterestTabQueryKey = useInterestQueryKey();
  const currProfileTabQueryKey = useProfileQueryKey();
  const profile = useProfileStore((state) => state.currentProfile)?.User;
  const myProfile = useAuth().user;
  const user = profile?.id ?? myProfile?.id ?? -1;
  const username = profile?.username ?? myProfile?.username ?? '';
  const search = useSearch();
  const path = usePathname();
  const isHome = path?.startsWith('/home');
  const isInterest = path?.startsWith('/explore/');
  const isProfile = path?.startsWith(`/${username}`);
  const interest = useInterest();

  const onMutate = async (
    type: string,
    tweetId: number,
    userId: number,
    count: number,
    postType: string = 'POST',
    parentId: number = -1
  ): Promise<{
    previousFeeds: {
      queryKey: QueryKeyType;
      previousFeed: FeedType | ExplorePersonalizedFeedDtoResponse | undefined;
    }[];
    oldTweet: TimelineFeed | undefined;
  }> => {
    if (tweetId) {
      queryClient.setQueryData(
        TWEET_QUERY_KEYS.tweetById(tweetId),
        (old: any) => {
          if (!old) return old;
          const updatedTweet = updateTweet(type, old.data[0], count);
          return {
            ...old,
            data: [updatedTweet],
          };
        }
      );
    }
    if (type === OPTIMISTIC_TYPES.REPLY) {
      queryClient.refetchQueries({
        queryKey: TWEET_QUERY_KEYS.getRepliesByTweetId(tweetId),
      });
      console.log('ds');
    }

    const tabsFeeds: {
      queryKey: QueryKeyType;
      previousFeed: FeedType | ExplorePersonalizedFeedDtoResponse | undefined;
    }[] = [];
    let oldTweet: TimelineFeed | undefined;

    const currentKey = isProfile
      ? currProfileTabQueryKey
      : !isHome
        ? isInterest
          ? currInterestTabQueryKey
          : currExploreTabQueryKey
        : postType.toLowerCase() === 'reply'
          ? TWEET_QUERY_KEYS.getRepliesByTweetId(parentId)
          : currTabQueryKey;
    let queryKeys: QueryKeyType[] = [
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU,
      TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING,
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU,
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_LATEST(search),
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_SEARCH_TOP(search),
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST(interest, TOP_TAB),
      EXPLORE_QUERY_KEYS.EXPLORE_FEED_INTEREST(interest, LATEST_TAB),
      PROFILE_QUERY_KEYS.profileLikes(user),
      PROFILE_QUERY_KEYS.profileReplies(user),
      PROFILE_QUERY_KEYS.profilePosts(user),
      PROFILE_QUERY_KEYS.profileMentions(user),
    ];
    {
      queryKeys = queryKeys.filter(
        (key) => JSON.stringify(key) !== JSON.stringify(currentKey)
      );
      queryKeys.unshift(currentKey);
    }

    console.log(queryKeys);
    for (const queryKey of queryKeys) {
      if (queryKey === EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU) {
        await optimisticsInterests(type, queryKey, tweetId, userId, count);
      } else await optimisticsTabs(type, queryKey, tweetId, userId, count);
    }

    return { previousFeeds: tabsFeeds, oldTweet: oldTweet };
  };

  const optimisticsInterests = async (
    type: string,
    queryKey: QueryKeyType,
    tweetId: number,
    userId: number,
    count: number
  ) => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed =
      queryClient.getQueryData<ExplorePersonalizedFeedDtoResponse>(queryKey);
    if (previousFeed) {
      const { oldTweets, pages } = handleOldInterestsTweets(
        userId,
        previousFeed,
        tweetId
      );
      if (oldTweets) {
        const newTweets: TimelineFeed[] = [];
        oldTweets.forEach((tweet) => {
          newTweets.push(updateTweet(type, tweet, count));
        });
        const timelineFeed: ExplorePersonalizedFeedDtoResponse =
          updateTweetPersonalizedInterestsData(previousFeed, pages, newTweets);

        queryClient.setQueryData<ExplorePersonalizedFeedDtoResponse>(
          queryKey,
          timelineFeed
        );
      }
    }
  };

  const optimisticsTabs = async (
    type: string,
    queryKey: QueryKeyType,
    tweetId: number,
    userId: number,
    count: number
  ) => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed = queryClient.getQueryData<FeedType>(queryKey);
    if (previousFeed) {
      const { oldTweets, pages } = handleOldTweets(
        userId,
        previousFeed,
        tweetId
      );

      if (oldTweets) {
        const newTweets: TimelineFeed[] = [];
        oldTweets.forEach((tweet) => {
          newTweets.push(updateTweet(type, tweet, count));
        });
        const timelineFeed: FeedType = updateTweetInInfiniteData(
          previousFeed,
          pages,
          newTweets
        );

        queryClient.setQueryData<FeedType>(queryKey, timelineFeed);
      }
    }
  };
  return { onMutate };
}
