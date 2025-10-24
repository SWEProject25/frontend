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
  const textRef = useRef<null | HTMLDivElement>(null);
  useEffect(
    function () {
      function handleClick() {
        showReplySettings();
        textRef.current?.focus();
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
      className="flex items-start w-full justify-center border-l-1 border-b-1 border-border px-4"
    >
      <div className="pt-1">
        <ProfileLogo />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col pt-1 pb-1 max-h-[calc(100vh-9rem)] overflow-y-auto">
          {scheduledTime && (
            <button
              onClick={open}
              aria-label="Scheduled Tweet Time"
              className="cursor-pointer hover:underline hover:underline-offset-1 hover:decoration-text-inactive"
            >
              <ScheduledTweetTime />
            </button>
          )}
          <TweetText divRef={textRef} />

          <div className="pt-3">
            <Poll />
          </div>
        </div>

        <div>
          <TweetReplySettings />
          <TweetFooter>
            <TweetOptionsBar />
            <TweetSubmitSection />
          </TweetFooter>
        </div>
      </div>
    </div>
  );
}
