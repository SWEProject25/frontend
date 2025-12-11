'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useParams } from 'next/navigation';
import { useTweetById } from '@/features/tweets/hooks/tweetQueries';
import Loader from '@/components/generic/Loader';

function Page() {
  const id = Number(useParams()?.['full-tweet']);
  const tweetQuery = useTweetById(id);
  const tweet = tweetQuery.data?.data[0] || null;

  // if (tweetQuery.isLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <FullTweet data={tweet} id={id} />
      {/* <Replies id={tweet?.postId || 0} /> */}
    </>
  );
}

export default Page;
