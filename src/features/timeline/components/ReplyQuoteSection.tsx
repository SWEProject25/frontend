'use client';

import {
  ADD_TWEET,
  MAX_ALLOWABLE_TWEET_LENGTH,
} from '@/features/timeline/constants/tweetConstants';
import { useAddTweet } from '../hooks/timelineQueries';
import { LOCAL_MEDIA } from '@/features/media/constants/mediaConstants';
import { TweetFormDataKeys } from '../types/api';
import TweetSubmitSection from './TweetSubmitSection';
import { useAddPostContext } from '../store/AddPostContext';
import { useParentId } from '../store/useTimelineStore';

export default function ReplyQuoteSections({ label }: { label: string }) {
  const selectors = useAddPostContext();

  const tweetText = selectors.useTweetText();
  const media = selectors.useMedia();
  const mentions = selectors.useMentions();
  const parentId = useParentId();
  const mutate = useAddTweet(label);

  const enableAddTweet =
    tweetText.trim().length !== 0
      ? tweetText.length <= MAX_ALLOWABLE_TWEET_LENGTH
      : media.length > 0;
  const enableSection = tweetText.trim().length !== 0;

  async function handleAddTweet() {
    const tweetFormData = new FormData();
    for (const med of media) {
      if (med.type === LOCAL_MEDIA) tweetFormData.append('media', med.data);
      else {
        const res = await fetch(med.data.images.original.url);
        const blob = await res.blob();
        const gifFile = new File([blob], med.data.title, { type: 'image/gif' });
        tweetFormData.append('media', gifFile);
      }
    }

    const mentionsId = mentions.map((mention) => mention.id);

    const allMentions = mentionsId.join(',');
    tweetFormData.append(TweetFormDataKeys.MENTIONS, allMentions);

    if (tweetText.trim().length !== 0) {
      tweetFormData.append(TweetFormDataKeys.CONTENT, tweetText);
    }
    tweetFormData.append(TweetFormDataKeys.TYPE, label);
    tweetFormData.append(TweetFormDataKeys.PARENT_ID, `${parentId}`);

    mutate.mutate(tweetFormData);
  }

  return (
    <TweetSubmitSection
      handleAddTweet={handleAddTweet}
      enableAddTweet={enableAddTweet}
      enableSection={enableSection}
      label={label === ADD_TWEET.QUOTE ? 'Post' : 'Reply'}
    />
  );
}
