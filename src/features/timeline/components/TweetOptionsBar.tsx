'use client';
import Icon from '../../../components/ui/home/Icon';

import TweetImages from './TweetImages';
import { MAX_MEDIA_NUM } from '@/features/media/constants/mediaConstants';
import { useRouter } from 'next/navigation';
import Emoji from '@/features/media/components/Emoji';
import { useAddPostContext } from '../store/AddPostContext';
export default function TweetOptionsBar({
  showGif = true,
}: {
  showGif?: boolean;
}) {
  const selectors = useAddPostContext();

  const { open: openGif, close: closeGif } = selectors.useActions();
  const isGifOpen = selectors.useGifVisibility();
  const media = selectors.useMedia();
  const router = useRouter();

  const handleOpenGif = () => {
    if (media.length !== MAX_MEDIA_NUM) {
      if (isGifOpen) {
        closeGif();
        router.replace('home', { scroll: false });
      } else {
        openGif();
        // router.push('i/foundmedia/search', { scroll: false });
      }
    }
  };

  return (
    <div
      data-testid="tweet-options-bar"
      className="flex flex-1 items-center mt-2 mr-auto h-10"
    >
      <TweetImages />

      <Icon
        data-testid="tweet-option-gif"
        disabled={media.length === MAX_MEDIA_NUM}
        onClick={handleOpenGif}
        title="GIF"
        path="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.88 3 21 4.119 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.12 21 3 19.881 3 18.5v-13zM5.5 5c-.28 0-.5.224-.5.5v13c0 .276.22.5.5.5h13c.28 0 .5-.224.5-.5v-13c0-.276-.22-.5-.5-.5h-13zM18 10.711V9.25h-3.74v5.5h1.44v-1.719h1.7V11.57h-1.7v-.859H18zM11.79 9.25h1.44v5.5h-1.44v-5.5zm-3.07 1.375c.34 0 .77.172 1.02.43l1.03-.86c-.51-.601-1.28-.945-2.05-.945C7.19 9.25 6 10.453 6 12s1.19 2.75 2.72 2.75c.85 0 1.54-.344 2.05-.945v-2.149H8.38v1.032H9.4v.515c-.17.086-.42.172-.68.172-.76 0-1.36-.602-1.36-1.375 0-.688.6-1.375 1.36-1.375z"
      />

      <Emoji />

      <Icon
        data-testid="tweet-option-location"
        disabled={true}
        path="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"
      />
    </div>
  );
}
