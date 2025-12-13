'use client';
import XModal from '@/components/ui/hoc/XModal';
import TweetFooter from './TweetFooter';
import ProfileLogo from '../../../components/ui/home/ProfileLogo';
import TweetText from './TweetText';

import React, { useEffect, useMemo, useRef } from 'react';
import TweetOptionsBar from './TweetOptionsBar';

import MediaPreview from '@/features/media/components/MediaPreview';

import Mention from './Mention';
import AddPostSection from './AddPostSection';
import {
  createAddTweetSelectors,
  createAddTweetStore,
} from '../store/useAddPostStore';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  const useStore = useMemo(() => createAddTweetStore(), []);
  const selectors = useMemo(
    () => createAddTweetSelectors(useStore),
    [useStore]
  );
  const isSending = selectors.useIsSending();

  const { clearMedia, setTweetText } = selectors.useActions();
  const ref = useRef<HTMLDivElement>(null);
  const wasSendingRef = useRef(false);

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

  // Track when sending starts
  useEffect(() => {
    if (isSending) {
      wasSendingRef.current = true;
    }
  }, [isSending]);

  // Close modal after successful tweet send
  useEffect(() => {
    // Only close if we were sending and now we're done (tweet sent successfully)
    if (
      wasSendingRef.current &&
      !isSending &&
      !hasText &&
      !hasmMedia &&
      isOpen
    ) {
      wasSendingRef.current = false;
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSending, hasText, hasmMedia, isOpen, onClose]);

  // Clear draft when modal closes (if user cancels)
  const handleClose = () => {
    // Clear the draft
    setTweetText('');
    clearMedia();
    wasSendingRef.current = false;
    onClose();
  };

  return (
    <XModal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title=""
      showCloseButton={true}
      showLogo={false}
      padding={false}
    >
      <div
        id="compose-modal"
        ref={ref}
        data-testid="compose-modal-container"
        className="relative flex flex-col items-start w-full"
      >
        {isSending && (
          <div
            data-testid="tweet-sending-progress"
            className="h-0.5 min-w-3/12 bg-primary absolute top-0 left-0 right-0 z-20"
          ></div>
        )}

        {/* Overlay when sending */}
        {isSending && (
          <div
            data-testid="tweet-sending-overlay"
            className="absolute inset-0 bg-black/30 z-10 cursor-default"
          />
        )}

        <div
          data-testid="compose-modal-content"
          className="relative flex items-start w-full px-4 pt-16 pb-4"
        >
          <div className="pt-1 pr-3" data-testid="tweet-profile-logo">
            <ProfileLogo />
          </div>
          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex flex-col mb-3 max-h-[50vh] overflow-y-auto">
              <TweetText />

              <div className="mt-2">
                {/* <Poll /> */}
                <MediaPreview />
              </div>
            </div>
            {!isSending && (
              <div className="border-t border-border pt-3">
                {/* <TweetReplySettings /> */}
                <Mention />
                <TweetFooter>
                  <TweetOptionsBar showGif={false} />
                  <AddPostSection />
                </TweetFooter>
              </div>
            )}
          </div>
        </div>
      </div>
    </XModal>
  );
}
