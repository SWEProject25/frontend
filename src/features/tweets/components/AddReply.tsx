import { useTweetStore } from '../store/tweetStore';
import AddReplySubTweet from './AddReplySubTweet';

export default function AddReply() {
  const tweet = useTweetStore((store) => store.currentTweet);
  const content = {
    text: tweet?.text,
    media: [],
  };
  return (
    <div className="p-4" data-testid="add-reply-component">
      {tweet && <AddReplySubTweet tweet={tweet} content={content} />}
    </div>
  );
}
