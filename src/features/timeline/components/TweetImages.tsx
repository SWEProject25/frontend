'use client';
import Icon from '@/components/ui/home/Icon';
import React, { useId } from 'react';
import {
  MAX_MEDIA_NUM,
  MAX_MEDIA_SIZE,
} from '@/features/media/constants/mediaConstants';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import { MEDIA_TYPES } from '@/features/media/constants/mediaTypes';
import { useAddPostContext } from '../store/AddPostContext';

export default function TweetImages() {
  const inputId = useId();
  const selectors = useAddPostContext();

  const { addMedia } = selectors.useActions();
  const media = selectors.useMedia();

  const mediaNum = media.length;

  function handleImportImage(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const arrayFiles: File[] = Array.from(files);
    if (!arrayFiles.every((media) => MEDIA_TYPES.includes(media.type))) {
      toasterMessage(
        'Please choose up valid format ' + MEDIA_TYPES.join(','),
        'bottom-center',
        'error'
      );
      e.target.value = '';
      return;
    }
    if (arrayFiles.length + mediaNum > MAX_MEDIA_NUM) {
      toasterMessage(
        'Please choose up to 4 photos, video or GIFs',
        'bottom-center',
        'error'
      );
      e.target.value = '';
      return;
    }

    if (!arrayFiles.every((media) => media.size <= MAX_MEDIA_SIZE)) {
      toasterMessage(
        'You can not upload any media larger than 100 MB please choose smaller media',
        'bottom-center',
        'error'
      );

      e.target.value = '';
      return;
    }

    addMedia(arrayFiles);
    e.target.value = '';
  }

  return (
    <div className="relative flex items-center justify-center">
      <label
        htmlFor={inputId}
        aria-label="Add media"
        className={
          mediaNum < MAX_MEDIA_NUM ? 'cursor-pointer' : 'pointer-events-none'
        }
      >
        <Icon
          disabled={mediaNum === MAX_MEDIA_NUM}
          title="Media"
          path="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"
        />
      </label>
      <input
        disabled={mediaNum === MAX_MEDIA_NUM}
        data-testid={`media-import`}
        type="file"
        id={inputId}
        multiple
        accept={MEDIA_TYPES.join(',')}
        className="hidden"
        onChange={handleImportImage}
      />
    </div>
  );
}
