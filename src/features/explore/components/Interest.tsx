'use client';
import React from 'react';
import { useExploreInterest } from '../hooks/exploreQueries';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { Loader } from '@/components/generic';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import Tweet from '@/features/tweets/components/Tweet';
import { useInterest } from '../store/useExploreStore';

export default function Interest() {
  const interest = useInterest();
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useExploreInterest(interest);
  const pages = data?.pages.flat();
  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;
  if (!hasInitialData && !isLoading)
    return (
      <div className="flex -flex-1 justify-center items-center text-center">
        No such Interest available Right Now
      </div>
    );

  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet, ind) => {
        return (
          <Tweet
            data-testid={`${tweet.userId}${tweet.postId}${tweet.date}`}
            data={tweet}
            key={ind}
          />
        );
      })}
    </React.Fragment>
  ));

  return isError ? (
    <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="tweet-list-interest-loading"
    >
      <Loader />
    </div>
  ) : (
    <>
      <InfiniteScroll
        data-testid="tweet-interest-list"
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
        hasInitialData={hasInitialData}
        showNoMoreData={false}
      >
        <div
          className="flex flex-col w-full"
          data-testid="render-tweet-interest-list"
        >
          {renderTweets}
        </div>
      </InfiniteScroll>
    </>
  );
}
