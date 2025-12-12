import AddTweet from '@/features/timeline/components/AddTweet';
import { useTweetStore } from '../store/tweetStore';
import SubTweet from './SubTweet';
import { ADD_TWEET } from '@/features/timeline/constants/tweetConstants';

export default function AddReply() {
  const tweet = useTweetStore((store) => store.currentTweet);
  const content = {
    text: tweet?.isRepost ? tweet?.originalPostData?.text : tweet?.text,
    media: [],
  };
  return (
    <div className="p-4" data-testid="add-reply-component">
      {tweet && (
        <>
          <SubTweet tweet={tweet} content={content} isReply={true} />
          <AddTweet type={ADD_TWEET.REPLY} />
        </>
      )}
    </div>
  );
}
