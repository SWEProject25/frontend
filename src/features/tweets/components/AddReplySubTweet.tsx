import Avatar from '@/components/generic/Avatar';
import Content from './Content';
import Timing from './Timing';
import { TimelineFeed } from '@/features/timeline/types/api';
import { TweetContent } from '../types';
export default function AddReplySubTweet({
  tweet,
  content,
}: {
  tweet: TimelineFeed;
  content: TweetContent;
}) {
  return (
    <div className="flex w-full gap-2">
      <Avatar
        avatarImage={tweet?.avatar ?? null}
        name={tweet?.name}
        size="sm"
        position="relative"
        className="border-0"
      />
      <div className="flex flex-col items-center flex-1">
        <div
          className="flex items-center justify-between w-full"
          data-testid="tweet-header-add-reply"
        >
          <div className="flex items-center gap-1">
            <span className="font-bold">{tweet?.name}</span>
            <span className="text-gray-500">@{tweet?.username}</span>
            <span className="text-gray-500">.</span>
            <Timing time={tweet?.date} hover={false} />
          </div>
        </div>
        <Content content={content} />
        <div className="w-full mt-3">
          <span className="text-gray-400 text-md">Replying to </span>
          <span className="text-blue-400 text-md">@{tweet?.username}</span>
        </div>
      </div>
    </div>
  );
}
