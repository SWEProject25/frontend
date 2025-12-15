import React from 'react';
import { TimelineFeed, TimelineTweet } from '../types/api';
import { ADD_TWEET } from '../constants/tweetConstants';
import Tweet from '@/features/tweets/components/Tweet';
import DeletedTweet from '@/features/tweets/components/DeletedTweet';

export default function Reply({
  data,
  inProfile = false,
  withoutOriginal = false,
}: {
  data: TimelineFeed;
  inProfile?: boolean;
  withoutOriginal?: boolean;
}) {
  const tweetData = {
    ...(data.originalPostData as TimelineTweet),
    isRepost: data.originalPostData?.isRepost ?? false,
    isQuote: data.originalPostData?.isQuote ?? false,
  } as TimelineFeed;
  const showUpperColumn =
    data.originalPostData && data.originalPostData.isDeleted;
  return (
    <div>
      {data.originalPostData && data.originalPostData.isDeleted ? (
        <div className="flex p-3">
          <DeletedTweet id={data.originalPostData.postId} />
        </div>
      ) : (
        data.originalPostData &&
        (data.originalPostData.type !== ADD_TWEET.REPLY ? (
          <Tweet
            showColumn={true}
            showBorder={false}
            data-testid={`${tweetData.postId}${tweetData.userId}${tweetData.isQuote ? 1 : 0}`}
            data={tweetData}
            inProfile={inProfile}
            key={`${tweetData.postId}${tweetData.userId}${tweetData.date}`}
          />
        ) : (
          <Reply
            withoutOriginal={true}
            data-testid={`${tweetData.postId}${tweetData.userId}${tweetData.isRepost ? 1 : 0}${tweetData.isQuote ? 1 : 0}`}
            data={tweetData}
            inProfile={inProfile}
            key={`${tweetData.isRepost ? (tweetData.originalPostData ? tweetData.originalPostData.postId : tweetData.postId) : tweetData.postId}${tweetData.userId}${tweetData.isRepost ? 1 : 0}${tweetData.date}`}
          />
        ))
      )}

      <Tweet
        showBorder={!withoutOriginal}
        showColumn={withoutOriginal}
        showUpperColumn={showUpperColumn}
        data-testid={`${data.postId}${data.userId}${data.isQuote ? 1 : 0}`}
        data={data}
        inProfile={inProfile}
        key={`${data.postId}${data.userId}${data.date}`}
      />
    </div>
  );
}
