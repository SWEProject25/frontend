'use client';
import { useProfileFeed } from '../hooks/profileQueries';
import Tweet from '@/features/tweets/components/Tweet';
import Loader from '@/components/generic/Loader';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import React from 'react';
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
  const pages = data?.pages.flat();
  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet, ind) => (
        <Tweet
          data-testid={`${tweet.postId}${tweet.userId}${tweet.isRepost ? 1 : 0}${tweet.isQuote ? 1 : 0}`}
          data={tweet}
          key={ind}
        />
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;
  return isError ? (
    <div>Error {error.message}</div>
  ) : isLoading ? (
    <div className="flex justify-center items-center h-64 mx-4">
      <Loader />
    </div>
  ) : (
    <InfiniteScroll
      isLoadingInitial={isLoading}
      isLoadingMore={isFetchingNextPage}
      loadMore={() => hasNextPage && fetchNextPage()}
      hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
      hasInitialData={hasInitialData}
    >
      <div className="flex flex-col w-full">{renderTweets} </div>
    </InfiniteScroll>
  );
}
