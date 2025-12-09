'use client';

import { useExploreSearchFeed } from '../hooks/exploreQueries';
import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import Loader from '@/components/generic/Loader';
import toasterMessage from '@/components/ui/home/ToasterMessage';

export default function SearchTweets() {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useExploreSearchFeed();

  console.log(data);
  const pages = data?.pages.flat();

  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet, ind) => (
        <Tweet
          data-testid={`explore-search${tweet.userId}${tweet.postId}${tweet.date}`}
          data={tweet}
          key={ind}
        />
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;
  return isError ? (
    <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="explore-search-tweet-list-loading"
    >
      <Loader />
    </div>
  ) : (
    <>
      <InfiniteScroll
        data-testid="tweet-search-list"
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
        hasInitialData={hasInitialData}
      >
        <div
          className="flex flex-col w-full"
          data-testid="explore-search-render-tweet-list"
        >
          {renderTweets}{' '}
        </div>
        {/* <ul className="w-full">{renderTweets} </ul> */}
      </InfiniteScroll>
    </>
  );
}
