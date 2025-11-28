'use client';
import React from 'react';
import FullTweet from '@/features/tweets/components/FullTweet';
import { useTweetStore } from '@/features/tweets/store/tweetStore';
import { useParams } from 'next/navigation';

function Page() {
  const tweet = useTweetStore((store) => store.currentTweet);
  // const tweets = useTweetStore((store) => store.currentTimeLineFeed);
  // const params = useParams();
  // const tweetId = Number(params?.['full-tweet'] || 0);
  // const viewdTweet =
  //   tweets?.data?.posts?.find((post) => post.postId === tweetId) || null;

  return (
    <>
      <FullTweet data={tweet} />
      {/* <Replies id={tweet?.postId || 0} /> */}
    </>
  );
}

export default Page;
