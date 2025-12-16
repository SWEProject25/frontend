'use client';
import { useProfileFeed } from '../hooks/profileQueries';
import Tweet from '@/features/tweets/components/Tweet';
import Loader from '@/components/generic/Loader';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import React from 'react';
import { useProfileContext } from '@/app/[username]/ProfileProvider';
import { useAuthStore } from '@/features/authentication/store/authStore';
export default function Tweets() {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useProfileFeed();
  console.log(data);
  const { username } = useProfileContext();
  const currentUser = useAuthStore((s) => s.user);
  const isMine = Boolean(currentUser && currentUser.username === username);
  const pages = data?.pages.flat();
  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet) => (
        <Tweet
          data-testid={`${tweet.postId}${tweet.userId}${tweet.isRepost ? 1 : 0}${tweet.isQuote ? 1 : 0}`}
          data={tweet}
          inProfile={!isMine}
          key={`${tweet.isRepost ? (tweet.originalPostData ? tweet.originalPostData.postId : tweet.postId) : tweet.postId}${tweet.userId}${tweet.isRepost ? 1 : 0}${tweet.date}`}
          // key={i * 10 + ind}
        />
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;
  return isError ? (
    <div data-testid="profile-tweets-error">Error {error.message}</div>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="profile-tweets-loading"
    >
      <Loader />
    </div>
  ) : (
    <InfiniteScroll
      data-testid="profile-tweets-list"
      isLoadingInitial={isLoading}
      isLoadingMore={isFetchingNextPage}
      loadMore={() => hasNextPage && fetchNextPage()}
      hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
      hasInitialData={hasInitialData}
      // showNoMoreData={false}
      noMoreDataMessage=""
    >
      <div className="flex flex-col w-full">{renderTweets} </div>
    </InfiniteScroll>
  );
}
