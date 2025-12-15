import React from 'react';
import { TimelineFeed, TimelineTweet } from '../types/api';
import { ADD_TWEET } from '../constants/tweetConstants';
import Tweet from '@/features/tweets/components/Tweet';
import { useTweetById } from '@/features/tweets/hooks/tweetQueries';

export default function Reply({
  data,
  inProfile = false,
}: {
  data: TimelineFeed;
  inProfile?: boolean;
}) {
  const tweetData = {
    ...(data.originalPostData as TimelineTweet),
    isRepost: data.originalPostData?.isRepost ?? false,
    isQuote: data.originalPostData?.isQuote ?? false,
  } as TimelineFeed;

  return (
    <div>
      {data.originalPostData && (
        <Tweet
          showBorder={false}
          data-testid={`${tweetData.postId}${tweetData.userId}${tweetData.isQuote ? 1 : 0}`}
          data={tweetData}
          inProfile={inProfile}
          key={`${data.postId}${data.userId}${data.date}`}
        />
      )}
      <Tweet
        data-testid={`${data.postId}${data.userId}${data.isQuote ? 1 : 0}`}
        data={data}
        inProfile={inProfile}
        key={`${data.postId}${data.userId}${data.date}`}
      />
    </div>
  );
}
