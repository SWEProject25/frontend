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
import { timelineComposerSelectors } from '../store/useTimelineComposer';
import { getAddReplyStore } from '../store/replyRegistry';
import QuoteTweet, {
  quoteProps,
} from '@/features/tweets/components/QuoteTweet';

import { useActions } from '../store/useTimelineStore';

interface AddTweetProps {
  type: string;
  persistent?: boolean;
  id?: number;
  data?: quoteProps;
  showBorder?: boolean;
  isMine?: boolean;
}

export default function AddTweet({
  type,
  persistent = false,
  id = undefined,
  data = undefined,
  showBorder = true,
  isMine = false,
}: AddTweetProps) {
  const useStore = useMemo(() => {
    if (persistent) return null;
    if (id) return getAddReplyStore(id);
    return createAddTweetStore();
  }, [persistent, id]);

  const selectors = useMemo(() => {
    if (persistent) return timelineComposerSelectors;
    return createAddTweetSelectors(useStore!);
  }, [useStore, persistent]);

  const isSending = selectors.useIsSending();
  const isOpen = selectors.useGifVisibility();

  const { setShowCheckModal } = useActions();
  const ref = useRef<HTMLDivElement>(null);
  const hasText = selectors.useTweetText().length > 0 || false;
  const hasmMedia = selectors.useMedia().length > 0;
  useEffect(
    function () {
      if (hasText || hasmMedia) setShowCheckModal(true);
      else setShowCheckModal(false);
    },
    [hasText, hasmMedia, setShowCheckModal]
  );
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
        className={` relative flex flex-col items-start w-full h-full flex-1  ${showBorder && 'border-b border-border'} `}
      >
        {isSending && (
          <div
            data-testid="tweet-sending-progress"
            className="h-0.5 min-w-3/12 bg-primary "
          ></div>
        )}

        {isSending && (
          <div
            data-testid="tweet-sending-overlay"
            className="absolute inset-0 bg-black/30  z-10 cursor-default"
          />
        )}
        <div
          data-testid="add-tweet-content"
          className={` relative flex  items-start w-full justify-center flex-1  ${showBorder && 'border-b border-border px-4'} `}
        >
          <div className="pt-1" data-testid="tweet-profile-logo">
            <ProfileLogo />
          </div>
          <div className="flex flex-1 flex-col gap-1 ">
            <div className="flex flex-col pt-1 pb-1 max-h-[calc(100vh-9rem)] overflow-y-auto">
              <TweetText
                placeHolder={
                  type === ADD_TWEET.POST
                    ? "What's happening?"
                    : type === ADD_TWEET.QUOTE
                      ? 'Add a comment'
                      : isMine
                        ? 'Add another post'
                        : 'Post your reply'
                }
              />

              <div>
                {/* <Poll /> */}
                <MediaPreview />
              </div>
            </div>
            {!(isSending && type === ADD_TWEET.POST) && (
              <div>
                <Mention />
                {type === ADD_TWEET.QUOTE && data !== undefined && (
                  <div className="flex pb-3">
                    <QuoteTweet {...data} />
                  </div>
                )}
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
