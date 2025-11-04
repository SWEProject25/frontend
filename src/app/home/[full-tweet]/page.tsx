'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useTweetStore } from '@/features/tweets/store/tweetStore';

function Page() {
  const tweet = useTweetStore((store) => store.currentTweet);
  return (
    <>
      <FullTweet data={tweet} />
      {/* <Replies id={tweet?.postId || 0} /> */}
    </>
  );
}

export default Page;
