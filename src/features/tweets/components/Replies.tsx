'use client';

import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { useGetRepliesByTweetId } from '@/features/tweets/hooks/tweetQueries';
import Loader from '@/components/generic/Loader';

export default function TweetList({ id }: { id: number }) {
  // const {
  //   data: repliesData,
  //   error,
  //   isError,
  //   isLoading,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   hasNextPage,
  // } = useGetRepliesByTweetId(id || 0);
  // const pages = repliesData?.pages.flat();
  // const renderReplies = pages?.map((group, i) => (
  //   <React.Fragment key={i}>
  //     {group.data.replies.map((reply, ind) => (
  //       <Tweet data={reply} key={ind} />
  //     ))}
  //   </React.Fragment>
  // ));
  // const hasInitialData = pages ? pages[0].data.replies.length > 0 : false;
  // console.log({
  //   isLoading,
  //   isFetchingNextPage,
  //   hasNextPage,
  //   repliesData,
  // });
  // return isError ? (
  //   <div>Error {error.message}</div>
  // ) : isLoading ? (
  //   <Loader />
  // ) : (
  //   <>
  //     <InfiniteScroll
  //       isLoadingInitial={isLoading}
  //       isLoadingMore={isFetchingNextPage}
  //       loadMore={() => hasNextPage && fetchNextPage()}
  //       hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
  //       hasInitialData={hasInitialData}
  //     >
  //       <div className="flex flex-col gap-2 w-full">{renderReplies} </div>
  //     </InfiniteScroll>
  //   </>
  // );
}
