'use client';

import useAddTweetStore, {
  useMentions,
} from '@/features/timeline/store/useAddTweetStore';
import { MAX_ALLOWABLE_TWEET_LENGTH } from '@/features/timeline/constants/tweetConstants';
import { useAddTweet } from '../hooks/timelineQueries';
import useMedia from '@/features/media/store/useMedia';
import { LOCAL_MEDIA } from '@/features/media/constants/mediaConstants';
import { TweetFormDataKeys } from '../types/api';
import TweetSubmitSection from './TweetSubmitSection';
export default function AddPostSection() {
  const tweetText = useAddTweetStore((state) => state.tweetText);
  const media = useMedia((state) => state.media);
  const mentions = useMentions();

  const mutate = useAddTweet();

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
        console.log(gifFile);
        tweetFormData.append('media', gifFile);
      }
    }
    console.log(tweetFormData.getAll('media'));
    console.log(media);
    console.log(mentions);
    const mentionsId = mentions.map((mention) => mention.id);

    const allMentions = mentionsId.join(',');
    tweetFormData.append(TweetFormDataKeys.MENTIONS, allMentions);

    console.log('mentionsIds:', tweetFormData.getAll('mentionsIds'));

    if (tweetText.trim().length !== 0) {
      tweetFormData.append(TweetFormDataKeys.CONTENT, tweetText);
    }
    tweetFormData.append(TweetFormDataKeys.TYPE, 'POST');

    mutate.mutate(tweetFormData);
  }

  return (
    <TweetSubmitSection
      handleAddTweet={handleAddTweet}
      enableAddTweet={enableAddTweet}
      enableSection={enableSection}
      label="Post"
    />
  );
}
