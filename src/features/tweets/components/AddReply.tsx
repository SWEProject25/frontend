import { useTweetStore } from '../store/tweetStore';
import SubTweet from './SubTweet';

export default function AddReply() {
  const tweet = useTweetStore((store) => store.currentTweet);
  const content = {
    text: tweet?.text,
    media: [],
  };
  return (
    <div className="p-4" data-testid="add-reply-component">
      {tweet && <SubTweet tweet={tweet} content={content} isReply={true} />}
    </div>
  );
}
