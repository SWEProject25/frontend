'use client';

import Button from '../../../components/ui/home/Button';
import Icon from '@/components/ui/home/Icon';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import TypingProgressCircle from './TypingProgressCircle';
import usePollStore from '../store/usePollStore';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '@/features/timeline/constants/TweetConstants';
const MAX_ALLOWABLE_TWEET_LENGTH = MAX_TWEET_LENGTH + MAX_WARNING_TWEET_LENGTH;
export default function TweetSubmitSection() {
  const tweetText = useAddTweetStore((state) => state.tweetText);
  const isOpen = usePollStore((state) => state.isOpen);
  const choices = usePollStore((state) => state.choices);

  const isValidPoll =
    choices.filter((ch, ind) => {
      if (ind < 2) {
        return ch.trim().length !== 0;
      } else {
        if (ch === '') return true;
        else return ch.trim().length !== 0;
      }
    }).length === 4;

  const enableAddTweet =
    tweetText.trim().length !== 0
      ? tweetText.length <= MAX_ALLOWABLE_TWEET_LENGTH
        ? isOpen
          ? isValidPoll
          : true
        : false
      : false;
  const enableSection = tweetText.trim().length !== 0 || isOpen;
  return (
    <div className="flex  flex-row-reverse  items-center mt-2  ">
      <div className="ml-3 flex flex-1">
        <Button
          height="h-9"
          width="w-16"
          disabled={!enableAddTweet}
          size="text-base"
          label="Post"
          onClick={() => {}}
        />
      </div>

      {enableSection && (
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
          <TypingProgressCircle />
        </>
      )}
    </div>
  );
}
