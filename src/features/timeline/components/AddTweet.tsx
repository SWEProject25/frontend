'use client';
import TweetFooter from './TweetFooter';
import ProfileLogo from '../../../components/ui/home/ProfileLogo';
import TweetText from './TweetText';
import TweetReplySettings from './TweetReplySettings';
import Poll from './Poll';
import React, { useEffect, useRef } from 'react';
import TweetOptionsBar from './TweetOptionsBar';
import TweetSubmitSection from './TweetSubmitSection';
import ScheduledTweetTime from './schedule/ScheduledTweetTime';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import useScheduleStore from '../store/useScheduleStore';
import MediaPreview from '@/features/media/components/MediaPreview';
import usePollStore from '../store/usePollStore';
import useMedia from '@/features/media/store/useMedia';
import { useMenuName } from '@/components/ui/home/XMenu';
import { GROK_MENU, REPLY_MENU } from '../constants/menuName';
export default function AddTweet() {
  const scheduledTime = useAddTweetStore((state) => state.scheduledTime);
  const isSending = useAddTweetStore((state) => state.isSending);
  const error = useAddTweetStore((state) => state.error);
  const isReplySettingsVisible = useAddTweetStore(
    (state) => state.selectedReplyOption
  );
  const showReplySettings = useAddTweetStore(
    (state) => state.updateReplyOption
  );
  const open = useScheduleStore((state) => state.open);

  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<null | HTMLDivElement>(null);

  const hasText =
    useAddTweetStore((state) => state.tweetText).length > 0 || false;
  const isopenPoll = usePollStore((state) => state.isOpen) || false;
  const hasmMedia = useMedia((state) => state.media).length > 0;
  const menuName = useMenuName();
  const isOpenMenu = menuName === GROK_MENU || menuName === REPLY_MENU;
  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      if (hasText || isopenPoll || hasmMedia || isOpenMenu) {
        console.log(event);
        event.preventDefault();
        // event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [hasText, isopenPoll, hasmMedia, isOpenMenu]);

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
      className=" relative flex flex-col items-start w-full   border-b-1 border-border "
    >
      {/* {error && (
        <div className="flex w-full  p-1 bg-error-message rounded-xs h-8">
          <span className="text-base">
            somthing wnet wrong, but don&apos;t fret —— let&apos;s give it
            another shot.
          </span>
        </div>
      )} */}
      {isSending && <div className="h-0.5 min-w-3/12 bg-primary "></div>}

      {/* Overlay when sending */}
      {isSending && (
        <div className="absolute inset-0 bg-black/30  z-10 cursor-default" />
      )}
      <div className=" relative flex  items-start w-full justify-center  border-b-1 border-border px-4">
        <div className="pt-1">
          <ProfileLogo />
        </div>
        <div className="flex flex-1 flex-col gap-1 ">
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

            <div>
              <Poll />
              <MediaPreview />
            </div>
          </div>
          {!isSending && (
            <div>
              <TweetReplySettings />
              <TweetFooter>
                <TweetOptionsBar />
                <TweetSubmitSection />
              </TweetFooter>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
