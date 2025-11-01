'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS, useFeedForYou } from '../hooks/timelineQueries';
import { timelineApi } from '../services/timelineAPi';
import { TimelineFeedDtoResponse } from '../types/api';
import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import InfiniteScrollContainer from '@/components/generic/InfiniteScrollContainer';

export default function TweetList() {
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useFeedForYou();

  const pages = data?.pages.flat();
  const renderTweets = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((tweet, ind) => (
        <Tweet data={tweet} key={ind} />
      ))}
    </React.Fragment>
  ));

  return isError ? (
    <div>Error {error.message}</div>
  ) : isLoading ? (
    <div>...loading</div>
  ) : (
    <>
      {/* <InfiniteScrollContainer
        onLoadMore={() => hasNextPage && fetchNextPage()}
        isLoading={isFetchingNextPage || isLoading}
        hasMore={hasNextPage}
      >
        <ul>{renderTweets} </ul>
      </InfiniteScrollContainer> */}
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
      >
        <div className="flex flex-col gap-2 w-full">{renderTweets} </div>
        {/* <ul className="w-full">{renderTweets} </ul> */}
      </InfiniteScroll>
    </>
  );
}
