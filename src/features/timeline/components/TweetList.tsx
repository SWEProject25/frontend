'use client';

import { useTimelineFeed } from '../hooks/timelineQueries';
import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
// import InfiniteScrollContainer from '@/components/generic/InfiniteScrollContainer';
import Loader from '@/components/generic/Loader';
import { TimelineFeedDtoResponse } from '../types/api';
import toasterMessage from '@/components/ui/home/ToasterMessage';

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
  console.log(data);
  const setStoreTimeLine = useTweetStore((store) => store.setTimeLineFeed);
  const pages = data?.pages.flat();

  // Store the first group of tweets in the store when data changes
  React.useEffect(() => {
    if (pages && pages.length > 0) {
      // Type: TimelineFeedDtoResponse
      setStoreTimeLine(pages[0] as TimelineFeedDtoResponse);
    }
  }, [pages, setStoreTimeLine]);

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

  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;
  return isError ? (
    <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="tweet-list-loading"
    >
      <Loader />
    </div>
  ) : (
    <>
      <InfiniteScroll
        data-testid="tweet-list"
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
        hasInitialData={hasInitialData}
      >
        <div className="flex flex-col w-full" data-testid="render-tweet-list">
          {renderTweets}{' '}
        </div>
        {/* <ul className="w-full">{renderTweets} </ul> */}
      </InfiniteScroll>
    </>
  );
}
