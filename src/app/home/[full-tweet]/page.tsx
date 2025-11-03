'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import Replies from '@/features/tweets/components/Replies';
import { useGetRepliesByTweetId } from '@/features/tweets/hooks/tweetQueries';

function Page() {
  const tweet = useTweetStore((store) => store.currentTweet);

  const repliesResponse = useGetRepliesByTweetId(tweet?.postId || 0);
  const replies = repliesResponse?.data?.data || null;

  return (
    <>
      <FullTweet data={tweet} replies={replies} />
      {/* <Replies id={tweet?.postId || 0} /> */}
    </>
  );
}

export default Page;
