import AddTweet from '@/features/timeline/components/AddTweet';
import { useTweetStore } from '../store/tweetStore';
import QuoteTweet from './QuoteTweet';
import SubTweet from './SubTweet';
import { ADD_TWEET } from '@/features/timeline/constants/tweetConstants';

export default function AddQuote() {
  const tweet = useTweetStore((store) => store.currentTweet);
  const content = {
    text: tweet?.text,
    media: [],
  };
  const tweetUsed = tweet?.isRepost ? tweet?.originalPostData : tweet;
  const quoteData = tweetUsed
    ? {
        postId: tweetUsed.postId,
        userId: tweetUsed.userId,
        tweetContent: {
          text: tweetUsed.text,
          media: tweetUsed.media,
          mentions: tweetUsed.mentions || [],
        },
        avatar: tweetUsed.avatar ?? null,
        name: tweetUsed.name,
        username: tweetUsed.username,
        isVerified: tweetUsed.verified ?? false,
        date: tweetUsed.date,
        isInModal: true,
      }
    : undefined;
  return (
    <div className="pt-10 px-2" data-testid="add-reply-component">
      {tweet && quoteData && (
        <>
          {/* <QuoteTweet {...quoteData} /> */}
          <AddTweet
            type={ADD_TWEET.QUOTE}
            showBorder={false}
            data={quoteData}
          />
        </>
      )}
    </div>
  );
}
