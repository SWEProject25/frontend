'use client';
import { useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB } from '../constants/menuName';
import {
  FeedType,
  QueryKeyType,
  TimelineFeed,
  TimelineTweet,
} from '../types/api';
import { OPTIMISTIC_TYPES } from '../constants/api';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import { TWEET_QUERY_KEYS } from '@/features/tweets/hooks/tweetQueries';
import { usePathname, useRouter } from 'next/navigation';
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
  Tweets: TimelineFeed[],
  type: string
): FeedType {
  let tweetIndx = 0;
  const maxIndx = Tweets.length - 1;
  if (
    type === OPTIMISTIC_TYPES.BLOCK ||
    type === OPTIMISTIC_TYPES.MUTE ||
    type === OPTIMISTIC_TYPES.DELETE
  ) {
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

function updateTweetPersonalizedInterestsData(
  data: ExplorePersonalizedFeedDtoResponse,
  pages: string[],
  Tweets: TimelineFeed[],
  type: string
): ExplorePersonalizedFeedDtoResponse {
  let tweetIndx = 0;
  const maxIndx = Tweets.length - 1;
  if (
    type === OPTIMISTIC_TYPES.BLOCK ||
    type === OPTIMISTIC_TYPES.MUTE ||
    type === OPTIMISTIC_TYPES.DELETE
  ) {
    const newFeed = Object.keys(data.data).reduce(
      (acc, category) => {
        if (!pages.includes(category)) acc[category] = data.data[category];
        else
          acc[category] = data.data[category].filter((tweet, i) => {
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
          });
        return acc;
      },
      {} as Record<string, TimelineFeed[]>
    );
    return { ...data, data: newFeed };
  } else {
    const newFeed = Object.keys(data.data).reduce(
      (acc, category) => {
        if (!pages.includes(category)) acc[category] = data.data[category];
        else
          acc[category] = data.data[category].map((tweet, i) => {
            if (
              tweetIndx <= maxIndx &&
              tweet.postId === Tweets[tweetIndx].postId &&
              tweet.isRepost === Tweets[tweetIndx].isRepost &&
              tweet.userId === Tweets[tweetIndx].userId
            ) {
              return Tweets[tweetIndx++];
            } else return tweet;
          });
        return acc;
      },
      {} as Record<string, TimelineFeed[]>
    );
    return { ...data, data: newFeed };
  }
}
function updateTweet(
  type: string,
  tweet: TimelineFeed,
  userId: number
): TimelineFeed {
  let updatedTweet = { ...tweet };
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            likesCount: original.isLikedByMe
              ? original.likesCount - 1
              : original.likesCount + 1,
            isLikedByMe: !original.isLikedByMe,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else {
        updatedTweet = {
          ...tweet,
          likesCount: tweet.isLikedByMe
            ? tweet.likesCount - 1
            : tweet.likesCount + 1,
          isLikedByMe: !tweet.isLikedByMe,
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
            retweetsCount: original.isRepostedByMe
              ? original.retweetsCount - 1
              : original.retweetsCount + 1,
            isRepostedByMe: !original.isRepostedByMe,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else
        updatedTweet = {
          ...tweet,
          retweetsCount: tweet.isRepostedByMe
            ? tweet.retweetsCount - 1
            : tweet.retweetsCount + 1,
          isRepostedByMe: !tweet.isRepostedByMe,
        };
      return updatedTweet;

    case OPTIMISTIC_TYPES.Quote:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            retweetsCount: original.retweetsCount + 1,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else
        updatedTweet = {
          ...tweet,
          retweetsCount: tweet.retweetsCount + 1,
        };
      return updatedTweet;

    case OPTIMISTIC_TYPES.REPLY:
      if (tweet.isRepost) {
        const original = tweet.originalPostData;
        let updatedOriginal = original;
        if (original) {
          updatedOriginal = {
            ...original,
            commentsCount: original.commentsCount + 1,
          };
        }
        updatedTweet = { ...tweet, originalPostData: updatedOriginal };
      } else
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
    case OPTIMISTIC_TYPES.DELETE:
      // happens in updateTweetInInfiniteData with shouldRemove flag
      return tweet;

    default:
      return tweet;
  }
}
function handleOldTweets(
  type: string,
  userId: number,
  feed: FeedType,
  tweetId?: number
): { oldTweets: TimelineFeed[] | undefined; pages: number[] } {
  const pages: number[] = [];
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
    case OPTIMISTIC_TYPES.REPOST:
    case OPTIMISTIC_TYPES.Quote:
    case OPTIMISTIC_TYPES.DELETE:
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

function handleOldInterestsTweets(
  type: string,
  userId: number,
  feed: ExplorePersonalizedFeedDtoResponse,
  tweetId?: number
): { oldTweets: TimelineFeed[] | undefined; pages: string[] } {
  const pages: string[] = [];
  switch (type) {
    case OPTIMISTIC_TYPES.LIKE:
    case OPTIMISTIC_TYPES.REPOST:
    case OPTIMISTIC_TYPES.Quote:
    case OPTIMISTIC_TYPES.DELETE:
      const oldTweets: TimelineFeed[] = [];
      Object.keys(feed.data).map((category) =>
        feed.data[category].forEach((post, i) => {
          if (post.isRepost && post.originalPostData) {
            if (post.originalPostData.postId === tweetId) {
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
    case OPTIMISTIC_TYPES.FOLLOW:
    case OPTIMISTIC_TYPES.BLOCK:
    case OPTIMISTIC_TYPES.MUTE:
      const tweets: TimelineFeed[] = [];
      Object.keys(feed.data).map((category) =>
        feed.data[category].forEach((post, i) => {
          if (
            post.userId === userId ||
            post.originalPostData?.userId === userId
          ) {
            if (!pages.includes(category)) pages.push(category);
            tweets.push(feed.data[category][i]);
          }
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

export function useOptimisticTweet() {
  const queryClient = useQueryClient();
  const currTabQueryKey = useTimelineQueryKey();
  const currExploreTabQueryKey = useExploreQueryKey();
  const currInterestTabQueryKey = useInterestQueryKey();
  const currProfileTabQueryKey = useProfileQueryKey();
  const setCurrentTweet = useTweetStore((state) => state.setCurrentTweet);
  const currentTweet = useTweetStore((state) => state.currentTweet);
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
  const selectedInteretsTab = useSelectedInterestTab();
  // console.log(path, username, user, profile, myProfile);
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
      previousFeed: FeedType | ExplorePersonalizedFeedDtoResponse | undefined;
    }[];
    oldTweet: TimelineFeed | undefined;
  }> => {
    if (tweetId)
      queryClient.setQueryData(
        TWEET_QUERY_KEYS.tweetById(tweetId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: updateTweet(type, old.data, userId),
          };
        }
      );

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
    const queryKeys: QueryKeyType[] = [
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
    ].filter((key) => JSON.stringify(key) !== JSON.stringify(currentKey));
    queryKeys.unshift(currentKey);
    // }
    console.log(queryKeys);
    for (const queryKey of queryKeys) {
      let result;
      if (queryKey === EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU) {
        result = await optimisticsInterests(
          type,
          userId,
          queryKey,
          myProfile?.id,
          tweetId,
          isRepost
        );
      } else
        result = await optimisticsTabs(
          type,
          userId,
          queryKey,
          myProfile?.id,
          tweetId,
          isRepost
        );

      tabsFeeds.push({
        queryKey: queryKey,
        previousFeed: result.previousFeed,
      });
      if (result.oldTweet) oldTweet = result.oldTweet;
    }

    return { previousFeeds: tabsFeeds, oldTweet: oldTweet };
  };

  const optimisticsInterests = async (
    type: string,
    userId: number,
    queryKey: typeof EXPLORE_QUERY_KEYS.EXPLORE_FEED_FOR_YOU,
    myId: number | undefined,
    tweetId?: number,
    isRepost?: boolean
  ): Promise<{
    previousFeed: ExplorePersonalizedFeedDtoResponse | undefined;
    oldTweet: TimelineFeed | undefined;
  }> => {
    await queryClient.cancelQueries({ queryKey: queryKey });
    const previousFeed =
      queryClient.getQueryData<ExplorePersonalizedFeedDtoResponse>(queryKey);
    let oldTweet: TimelineFeed | undefined;
    if (previousFeed) {
      const { oldTweets, pages } = handleOldInterestsTweets(
        type,
        userId,
        previousFeed,
        tweetId
      );

      if (oldTweets) {
        let timelineFeed: ExplorePersonalizedFeedDtoResponse;
        if (
          type === OPTIMISTIC_TYPES.BLOCK ||
          type === OPTIMISTIC_TYPES.MUTE ||
          type === OPTIMISTIC_TYPES.DELETE
        ) {
          timelineFeed = updateTweetPersonalizedInterestsData(
            previousFeed,
            pages,
            oldTweets,
            type
          );
        } else {
          const newTweets: TimelineFeed[] = [];
          oldTweets.forEach((tweet) => {
            newTweets.push(updateTweet(type, tweet, userId));
          });
          timelineFeed = updateTweetPersonalizedInterestsData(
            previousFeed,
            pages,
            newTweets,
            type
          );
          if (type === OPTIMISTIC_TYPES.REPOST) {
            const tweets = oldTweets.filter((tweet) => {
              if (
                tweet.userId === myId &&
                tweet.originalPostData?.isRepostedByMe === true
              ) {
                return true;
              } else return false;
            });
            if (tweets.length > 0) {
              console.log(tweets);
              const myTweet = tweets[0];
              timelineFeed = updateTweetPersonalizedInterestsData(
                timelineFeed,
                pages,
                oldTweets,
                OPTIMISTIC_TYPES.DELETE
              );
            }
          }
        }

        queryClient.setQueryData<ExplorePersonalizedFeedDtoResponse>(
          queryKey,
          timelineFeed
        );

        if (
          type === OPTIMISTIC_TYPES.BLOCK ||
          type === OPTIMISTIC_TYPES.MUTE ||
          type === OPTIMISTIC_TYPES.DELETE
        ) {
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
              setCurrentTweet(newTweet);
            } else {
            }
          }
        }
      }
    }
    return { previousFeed, oldTweet };
  };

  const optimisticsTabs = async (
    type: string,
    userId: number,
    queryKey: QueryKeyType,
    myId: number | undefined,
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
        let timelineFeed: FeedType;
        if (
          type === OPTIMISTIC_TYPES.BLOCK ||
          type === OPTIMISTIC_TYPES.MUTE ||
          type === OPTIMISTIC_TYPES.DELETE
        ) {
          timelineFeed = updateTweetInInfiniteData(
            previousFeed,
            pages,
            oldTweets,
            type
          );
        } else {
          const newTweets: TimelineFeed[] = [];
          oldTweets.forEach((tweet) => {
            newTweets.push(updateTweet(type, tweet, userId));
          });
          timelineFeed = updateTweetInInfiniteData(
            previousFeed,
            pages,
            newTweets,
            type
          );
          if (type === OPTIMISTIC_TYPES.REPOST) {
            const tweets = oldTweets.filter((tweet) => {
              if (
                tweet.userId === myId &&
                tweet.originalPostData?.isRepostedByMe === true
              ) {
                return true;
              } else return false;
            });
            if (tweets.length > 0) {
              console.log(tweets);
              const myTweet = tweets[0];
              timelineFeed = updateTweetInInfiniteData(
                timelineFeed,
                pages,
                oldTweets,
                OPTIMISTIC_TYPES.DELETE
              );
            }
          }
        }

        queryClient.setQueryData<FeedType>(queryKey, timelineFeed);

        if (
          type === OPTIMISTIC_TYPES.BLOCK ||
          type === OPTIMISTIC_TYPES.MUTE ||
          type === OPTIMISTIC_TYPES.DELETE
        ) {
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
              setCurrentTweet(newTweet);
            } else {
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
            previousFeed:
              | FeedType
              | ExplorePersonalizedFeedDtoResponse
              | undefined;
          }[];
          oldTweet: TimelineFeed | undefined;
        }
      | undefined
  ) {
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
