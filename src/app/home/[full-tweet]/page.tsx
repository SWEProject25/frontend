'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import { useParams } from 'next/navigation';
import { useTweetById } from '@/features/tweets/hooks/tweetQueries';
import Loader from '@/components/generic/Loader';

function Page() {
  const tweetQuery = useTweetById(Number(useParams()?.['full-tweet'] || 0));
  const tweet = tweetQuery.data?.data || null;
  console.log('Full Tweet:', tweet);
  // if (tweetQuery.isFetching && tweetQuery.data) {
  //   return <Loader />; // ✅ Hide old data
  // }
  return (
    <>
      <FullTweet data={tweet} />
      {/* <Replies id={tweet?.postId || 0} /> */}
    </>
  );
}

export default Page;
