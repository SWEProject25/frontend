'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useParams } from 'next/navigation';
import { useTweetById } from '@/features/tweets/hooks/tweetQueries';

function Page() {
  const id = Number(useParams()?.['full-tweet']);
  const tweetQuery = useTweetById(id);
  const tweet = tweetQuery.data?.data[0] || null;
  const isError = tweetQuery.isError;

  if (isError)
    return (
      <div className="flex justify-center items-center h-32">
        This Tweet not found, may be deleted.
      </div>
    );

  return (
    <>
      <FullTweet data={tweet} id={id} />
    </>
  );
}

export default Page;
