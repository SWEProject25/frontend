'use client';
import XModal from '@/components/ui/hoc/XModal';

import AddTweet from './AddTweet';
import { ADD_TWEET } from '../constants/tweetConstants';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  // const useStore = useMemo(() => createAddTweetStore(), []);
  // const selectors = useMemo(
  //   () => createAddTweetSelectors(useStore),
  //   [useStore]
  // );
  // const isSending = selectors.useIsSending();

  // const { clearMedia, setTweetText } = selectors.useActions();
  // const ref = useRef<HTMLDivElement>(null);
  // const wasSendingRef = useRef(false);

  // const hasText = selectors.useTweetText().length > 0 || false;
  // const hasmMedia = selectors.useMedia().length > 0;

  // useEffect(() => {
  //   const unloadCallback = (event: BeforeUnloadEvent) => {
  //     if (hasText || hasmMedia) {
  //       console.log(event);
  //       event.preventDefault();
  //       return '';
  //     }
  //   };

  //   window.addEventListener('beforeunload', unloadCallback);
  //   return () => window.removeEventListener('beforeunload', unloadCallback);
  // }, [hasText, hasmMedia]);

  // Track when sending starts
  // useEffect(() => {
  //   if (isSending) {
  //     wasSendingRef.current = true;
  //   }
  // }, [isSending]);

  // // Close modal after successful tweet send
  // useEffect(() => {
  //   // Only close if we were sending and now we're done (tweet sent successfully)
  //   if (
  //     wasSendingRef.current &&
  //     !isSending &&
  //     !hasText &&
  //     !hasmMedia &&
  //     isOpen
  //   ) {
  //     wasSendingRef.current = false;
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isSending, hasText, hasmMedia, isOpen, onClose]);

  // Clear draft when modal closes (if user cancels)
  const handleClose = () => {
    // Clear the draft
    // setTweetText('');
    // clearMedia();
    // wasSendingRef.current = false;
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
      <AddTweet type={ADD_TWEET.POST} />
    </XModal>
  );
}
