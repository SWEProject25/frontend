'use client';

import Button from '../../../components/ui/home/Button';
import Icon from '@/components/ui/home/Icon';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
const MAX_TWEET_LENGTH = 260; //blue color
const MAX_WARNING_TWEET_LENGTH = 20; // yellow color
export default function TweetSubmitSection() {
  const tweetText = useAddTweetStore((state) => state.tweetText);
  const disableAddTweet = tweetText.trim().length === 0;
  const progressRadius = tweetText.length < MAX_TWEET_LENGTH ? 10 : 13;
  const circumCircle = progressRadius * 2 * Math.PI;
  const progress =
    tweetText.length < MAX_TWEET_LENGTH
      ? {
          color: 'stroke-primary',
          valueColor: '',
        }
      : tweetText.length < MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH
        ? {
            color: 'stroke-warning',
            valueColor: 'text-text-inactive',
          }
        : tweetText.length < MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + 10
          ? {
              color: 'stroke-error',
              valueColor: 'text-error',
            }
          : {
              color: 'stroke-transparent',
              valueColor: 'text-error',
            };
  return (
    <div className="flex  flex-row-reverse gap-2 items-center py-3  ">
      <Button disabled={disableAddTweet} label="Post" onClick={() => {}} />

      {!disableAddTweet && (
        <>
          <div className="flex items-center hover:cursor-pointer pl-3 border-l-2 border-border h-10">
            <div className="rounded-full flex text-primary items-center justify-center border-border border-2 w-7 h-7  ">
              <Icon
                width="w-6"
                height="h-6"
                title="Add"
                size="w-4 h-4"
                path="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"
              />
            </div>
          </div>
          <div className="relative flex items-center justify-center w-7 h-7  ">
            <svg
              viewBox="0 0 30 30"
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {tweetText.length <
                MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + 10 && (
                <circle
                  r={`${progressRadius}`}
                  cx="15"
                  cy="15"
                  className={progress.color}
                  strokeWidth="3"
                  strokeDasharray={circumCircle}
                  strokeDashoffset={
                    tweetText.length <
                    MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH
                      ? circumCircle -
                        (tweetText.length * circumCircle) /
                          (MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH)
                      : 0
                  }
                  opacity="1"
                  transform="rotate(-90 14 14)"
                />
              )}
              {tweetText.length <
                MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH && (
                <circle
                  r={`${progressRadius}`}
                  cx="15"
                  cy="15"
                  className="stroke-border"
                  strokeWidth="2"
                  strokeDasharray={circumCircle}
                  strokeDashoffset={
                    -(tweetText.length * circumCircle) /
                    (MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH)
                  }
                  opacity="1"
                  transform="rotate(-90 14 14)"
                />
              )}
            </svg>
            {tweetText.length >= MAX_TWEET_LENGTH && (
              <span
                className={`flex pr-[1px] pb-1 absolute text-xs ${progress.valueColor}`}
              >
                {MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH - tweetText.length}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
