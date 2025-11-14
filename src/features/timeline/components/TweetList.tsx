'use client';

import { useTimelineFeed } from '../hooks/timelineQueries';
import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
// import InfiniteScrollContainer from '@/components/generic/InfiniteScrollContainer';
import Loader from '@/components/generic/Loader';

export default function TweetList() {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useTimelineFeed();

  const pages = data?.pages.flat();
  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet, ind) => (
        <Tweet data={tweet} key={ind} />
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
    <>
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
        hasInitialData={hasInitialData}
      >
        <div className="flex flex-col w-full">{renderTweets} </div>
        {/* <ul className="w-full">{renderTweets} </ul> */}
      </InfiniteScroll>
    </>
  );
}
