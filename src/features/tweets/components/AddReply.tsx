'use client';
import AddTweet from '@/features/timeline/components/AddTweet';
import { useTweetStore } from '../store/tweetStore';
import SubTweet from './SubTweet';
import { ADD_TWEET } from '@/features/timeline/constants/tweetConstants';
import { useAuth } from '@/features/authentication/hooks';

export default function AddReply() {
  const tweet = useTweetStore((store) => store.currentTweet);
  const content = {
    text: tweet?.isRepost ? tweet?.originalPostData?.text : tweet?.text,
    media: [],
  };
  const userId = useAuth().user?.id;
  const isMine =
    userId ===
    (tweet?.isRepost ? tweet?.originalPostData?.userId : tweet?.userId);
  return (
    <div className="pt-14 px-5" data-testid="add-reply-component">
      {tweet && (
        <>
          <SubTweet tweet={tweet} content={content} isReply={true} />
          <AddTweet type={ADD_TWEET.REPLY} showBorder={false} isMine={isMine} />
        </>
      )}
    </div>
  );
}
