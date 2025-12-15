'use client';
import XModal from '@/components/ui/hoc/XModal';

import AddTweet from './AddTweet';
import { ADD_TWEET } from '../constants/tweetConstants';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <XModal
      isOpen={isOpen}
      onClose={handleClose}
      overlayColor="bg-[rgba(91,112,131,0.4)]"
      size="4xl"
      title=""
      padding={false}
      showCloseButton={true}
      showLogo={false}
    >
      <div className="pt-14 px-5">
        <AddTweet type={ADD_TWEET.POST} />
      </div>
    </XModal>
  );
}
