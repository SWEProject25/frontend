'use client';
import TweetFooter from './TweetFooter';
import ProfileLogo from '../../componenets/ProfileLogo';
import TweetText from '../../componenets/TweetText';
import TweetReplySettings from './TweetReplySettings';
import Poll from './Poll';
import React, { useEffect, useRef, useState } from 'react';
import TweetOptionsBar from './TweetOptionsBar';
import TweetSubmitSection from './TweetSubmitSection';
import usePollStore from '@/services/usePollStore';
import ScheduledTweetTime from './ScheduledTweetTime';
import useAddTweetStore from '@/services/useAddTweetStore';
export default function AddTweet() {
  const [isOpenPoll, setIsOpenPoll] = useState(false);
  const reset = usePollStore((state) => state.reset);
  const scheduledTime = useAddTweetStore((state) => state.scheduledTime);
  const isOpenReplySettings = useAddTweetStore(
    (state) => state.isOpenReplySettings
  );
  const openReplySettings = useAddTweetStore(
    (state) => state.openReplySettings
  );

  const closePoll = () => {
    reset();
    setIsOpenPoll(false);
  };
  // const openPoll = () => setIsOpenPoll(true);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        openReplySettings();
      }
      if (formRef.current && !isOpenReplySettings) {
        formRef.current.addEventListener('click', handleClick, { once: true });
      }
    },
    [isOpenReplySettings, openReplySettings]
  );
  return (
    <form
      id="Add tweet"
      ref={formRef}
      className=" flex items-stretch  min-h-fit w-full  justify-center  border-l-1 border-b-1 border-border px-4 "
    >
      <ProfileLogo />
      <div className=" flex flex-1 flex-col items-stretch ">
        <div className="flex flex-col flex-1 items-stretch pt-1 ">
          {scheduledTime && (
            <button
              aria-label="Scheduled Tweet Time"
              className="cursor-pointer hover:underline hover:underline-offset-1 hover:decoration-text-inactive "
            >
              <ScheduledTweetTime />
            </button>
          )}
          <TweetText />
          {isOpenPoll && (
            <div className=" flex flex-1 items-stretch pt-3 h-fit">
              <Poll onClose={closePoll} />
            </div>
          )}
          <div className="flex items-stretch flex-1 flex-col">
            <TweetReplySettings />
            <TweetFooter>
              <TweetOptionsBar openPoll={setIsOpenPoll} />
              <TweetSubmitSection />
            </TweetFooter>
          </div>
        </div>
      </div>
    </form>
  );
}
