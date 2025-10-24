'use client';

import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
  MAX_RED_PROGRESS_STEPS,
} from '@/features/timeline/constants/TweetConstants';

export default function TypingProgressCircle() {
  const tweetText = useAddTweetStore((state) => state.tweetText);
  const progressRadius = tweetText.length < MAX_TWEET_LENGTH ? 10 : 13;
  const circumCircle = progressRadius * 2 * Math.PI;
  const progress =
    tweetText.length < MAX_TWEET_LENGTH
      ? {
          color: 'stroke-primary',
          valueColor: '',
          strokeWidth: '3',
        }
      : tweetText.length < MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH
        ? {
            color: 'stroke-warning',
            valueColor: 'text-text-inactive',
            strokeWidth: '3',
          }
        : tweetText.length <
            MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH + MAX_RED_PROGRESS_STEPS
          ? {
              color: 'stroke-error',
              valueColor: 'text-error',
              strokeWidth: '2',
            }
          : {
              color: 'stroke-transparent',
              valueColor: 'text-error',
              strokeWidth: '',
            };
  return (
    <div className="relative w-8 h-8 flex items-center justify-center mr-3">
      <svg
        viewBox="0 0 30 30"
        className="block w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {tweetText.length <
          MAX_TWEET_LENGTH +
            MAX_WARNING_TWEET_LENGTH +
            MAX_RED_PROGRESS_STEPS && (
          <circle
            r={`${progressRadius}`}
            cx="15"
            cy="15"
            className={progress.color}
            strokeWidth={progress.strokeWidth}
            strokeDasharray={circumCircle}
            strokeDashoffset={
              tweetText.length < MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH
                ? circumCircle -
                  (tweetText.length * circumCircle) /
                    (MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH)
                : 0
            }
            opacity="1"
            transform="rotate(-90 15 15)"
          />
        )}
        {tweetText.length < MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH && (
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
            transform="rotate(-90 15 15)"
          />
        )}
      </svg>
      {tweetText.length >= MAX_TWEET_LENGTH && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs ${progress.valueColor}`}>
            {MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH - tweetText.length}
          </span>
        </div>
      )}
    </div>
  );
}
