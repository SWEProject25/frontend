'use client';
import Icon from '@/components/ui/home/Icon';
import React, { useState } from 'react';
import usePollStore from '../store/usePollStore';
import { toast } from 'react-hot-toast';
import useMedia from '@/features/media/store/useMedia';
import {
  LOCAL_MEDIA,
  MAX_MEDIA_NUM,
  MAX_MEDIA_SIZE,
} from '@/features/media/constants/mediaConstants';
import toasterMessage from '@/components/ui/home/ToasterMessage';

//  accept=".jfif,.pjp,.jpg,.jpeg,.pjpeg,.png,.webp,.gif,.m4v,.mp4,.mov"

export default function TweetImages() {
  const isPollOpen = usePollStore((state) => state.isOpen);
  const addMedia = useMedia((state) => state.addMedia);
  const media = useMedia((state) => state.media);
  // const size = images.reduce((size, img) => size + img.size, 0);
  const mediaNum = media.length;
  console.log(mediaNum);
  // const [error, setError] = useState(false);

  function handleImportImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const arrayFiles = Array.from(files);
    // const newSizes = arrayFiles.reduce((size, img) => size + img.size, 0);
    // if (size + newSizes > MAX_MEDIA_SIZE) {
    //   e.target.value = '';
    //   // present error
    //   alert(
    //     'Alert : You reach max size of uploading 100 MB choose smaller one'
    //   );
    //   return;
    // }
    if (arrayFiles.length + mediaNum > MAX_MEDIA_NUM) {
      // present error
      // toast.error(
      //   'Alert : You can not upload more than 4 media (image , video , Gif)'
      // );

      toasterMessage('Please choose up to 4 photos, video or GIFs');

      e.target.value = '';
      return;
    }
    if (!arrayFiles.every((media) => media.size <= MAX_MEDIA_SIZE)) {
      // present error
      toasterMessage(
        'You can not upload any media larger than 100 MB please choose smaller media'
      );

      e.target.value = '';
      return;
    }
    // console.log(arrayFiles);

    addMedia(arrayFiles);
    console.log(media);

    // const k = new FormData();
    // k.append('file', files[0]);
    // console.log(k.getAll('file'));
    // Clear input to allow re-uploading same file
    e.target.value = '';
  }

  return (
    <div className="relative flex items-center justify-center">
      <label
        htmlFor="media"
        aria-label="Add media"
        className={
          !isPollOpen && mediaNum < MAX_MEDIA_NUM
            ? 'cursor-pointer'
            : 'pointer-events-none'
        }
      >
        <Icon
          disabled={isPollOpen || mediaNum === MAX_MEDIA_NUM}
          title="Media"
          path="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
        />
      </label>
      <input
        disabled={isPollOpen || mediaNum === MAX_MEDIA_NUM}
        type="file"
        id="media"
        multiple
        accept="image/jpeg,image/png,image/gif,video/mp4,video/mpeg,video/webm,video/quicktime"
        className="hidden"
        onChange={handleImportImage}
      />
    </div>
  );
}
