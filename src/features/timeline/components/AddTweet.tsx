'use client';
import TweetFooter from './TweetFooter';
import ProfileLogo from '../../../components/ui/home/ProfileLogo';
import TweetText from './TweetText';
import React, { useEffect, useMemo, useRef } from 'react';
import TweetOptionsBar from './TweetOptionsBar';

import MediaPreview from '@/features/media/components/MediaPreview';
import Mention from './Mention';
import AddPostSection from './AddPostSection';
import ReplyQuoteSections from './ReplyQuoteSection';
import { ADD_TWEET } from '../constants/tweetConstants';

import {
  createAddTweetSelectors,
  createAddTweetStore,
} from '../store/useAddPostStore';
import { AddPostStoreContext } from '../store/AddPostContext';
import GifModal from '@/features/media/components/GifModal';
export default function AddTweet({ type }: { type: string }) {
  const useStore = useMemo(() => createAddTweetStore(), [type]);
  const selectors = useMemo(
    () => createAddTweetSelectors(useStore),
    [useStore]
  );

  const isSending = selectors.useIsSending();
  const isOpen = selectors.useGifVisibility();

  // const error = useError();

  const ref = useRef<HTMLDivElement>(null);

  const hasText = selectors.useTweetText().length > 0 || false;
  const hasmMedia = selectors.useMedia().length > 0;
  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      if (hasText || hasmMedia) {
        console.log(event);
        event.preventDefault();
        return '';
      }
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [hasText, hasmMedia]);

  return (
    <AddPostStoreContext.Provider value={selectors}>
      <div
        id="Add tweet"
        ref={ref}
        data-testid="add-tweet-container"
        className=" relative flex flex-col items-start w-full border-b border-border "
      >
        {/* {error && (
        <div className="flex w-full  p-1 bg-error-message rounded-xs h-8">
        <span className="text-base">
            somthing wnet wrong, but don&apos;t fret —— let&apos;s give it
            another shot.
          </span>
        </div>
      )} */}
        {isSending && (
          <div
            data-testid="tweet-sending-progress"
            className="h-0.5 min-w-3/12 bg-primary "
          ></div>
        )}

        {/* Overlay when sending */}
        {isSending && (
          <div
            data-testid="tweet-sending-overlay"
            className="absolute inset-0 bg-black/30  z-10 cursor-default"
          />
        )}
        <div
          data-testid="add-tweet-content"
          className=" relative flex  items-start w-full justify-center  border-b border-border px-4"
        >
          <div className="pt-1" data-testid="tweet-profile-logo">
            <ProfileLogo />
          </div>
          <div className="flex flex-1 flex-col gap-1 ">
            <div className="flex flex-col pt-1 pb-1 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <TweetText />

              <div>
                {/* <Poll /> */}
                <MediaPreview />
              </div>
            </div>
            {!isSending && (
              <div>
                {/* <TweetReplySettings /> */}
                <Mention />
                <TweetFooter>
                  <TweetOptionsBar />
                  {type === ADD_TWEET.POST ? (
                    <AddPostSection />
                  ) : (
                    <ReplyQuoteSections label={type} />
                  )}
                </TweetFooter>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && <GifModal />}
    </AddPostStoreContext.Provider>
  );
}
