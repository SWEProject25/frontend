import { useTweetStore } from '../store/tweetStore';
import QuoteTweet from './QuoteTweet';
import SubTweet from './SubTweet';

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
    <div className="p-4" data-testid="add-reply-component">
      {tweet && quoteData && <QuoteTweet {...quoteData} />}
    </div>
  );
}
