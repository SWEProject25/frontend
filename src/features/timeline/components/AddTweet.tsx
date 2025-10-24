'use client';
import TweetFooter from './TweetFooter';
import ProfileLogo from '../../../components/ui/home/ProfileLogo';
import TweetText from '../../../components/ui/home/TweetText';
import TweetReplySettings from './TweetReplySettings';
import Poll from './Poll';
import React, { useEffect, useRef } from 'react';
import TweetOptionsBar from './TweetOptionsBar';
import TweetSubmitSection from './TweetSubmitSection';
import ScheduledTweetTime from './ScheduledTweetTime';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import useScheduleStore from '../store/useScheduleStore';
export default function AddTweet() {
  const scheduledTime = useAddTweetStore((state) => state.scheduledTime);
  const isReplySettingsVisible = useAddTweetStore(
    (state) => state.selectedReplyOption
  );
  const showReplySettings = useAddTweetStore(
    (state) => state.updateReplyOption
  );
  const open = useScheduleStore((state) => state.open);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        showReplySettings();
      }
      if (ref.current && !isReplySettingsVisible) {
        ref.current.addEventListener('click', handleClick, { once: true });
      }
    },
    [isReplySettingsVisible, showReplySettings]
  );
  return (
    <div
      id="Add tweet"
      ref={ref}
      className=" flex items-stretch  min-h-fit w-full  justify-center  border-l-1 border-b-1 border-border px-4 "
    >
      <ProfileLogo />
      <div className=" flex flex-1 flex-col items-stretch ">
        <div className="flex flex-col flex-1 items-stretch pt-1 ">
          {scheduledTime && (
            <button
              onClick={open}
              aria-label="Scheduled Tweet Time"
              className="cursor-pointer hover:underline hover:underline-offset-1 hover:decoration-text-inactive "
            >
              <ScheduledTweetTime />
            </button>
          )}
          <TweetText />

          <div className=" flex flex-1 items-stretch pt-3 h-fit">
            <Poll />
          </div>

          <div className="sticky bottom-0  flex items-stretch flex-1 flex-col">
            <TweetReplySettings />
            <TweetFooter>
              <TweetOptionsBar />
              <TweetSubmitSection />
            </TweetFooter>
          </div>
        </div>
      </div>
    </div>
  );
}
