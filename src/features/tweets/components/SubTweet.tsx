import Avatar from '@/components/generic/Avatar';
import Content from './Content';
import Timing from './Timing';
import { TimelineFeed } from '@/features/timeline/types/api';
import { TweetContent } from '../types';

export default function SubTweet({
  tweet,
  content,
  isReply = false,
}: {
  tweet: TimelineFeed;
  content: TweetContent;
  isReply?: boolean;
}) {
  const quoteData = tweet.originalPostData
    ? {
        postId: tweet.originalPostData.postId,
        userId: tweet.originalPostData.userId,
        tweetContent: {
          text: tweet.originalPostData.text,
          media: [],
          mentions: tweet.originalPostData.mentions || [],
        },
        avatar: tweet.originalPostData.avatar ?? null,
        name: tweet.originalPostData.name,
        username: tweet.originalPostData.username,
        isVerified: tweet.originalPostData.verified ?? false,
        date: tweet.originalPostData.date,
        isDeleted: tweet.originalPostData.isDeleted || false,
      }
    : undefined;
  const data = tweet?.isRepost ? tweet?.originalPostData : tweet;
  return (
    <div
      className="flex w-full gap-2"
      style={{ maxWidth: '100%', overflow: 'hidden' }}
    >
      <div className="flex flex-col items-center">
        <Avatar
          avatarImage={data?.avatar ?? null}
          name={data?.name}
          size="sm"
          position="relative"
          className="border-0"
        >
          <div className="flex"></div>
        </Avatar>
        <div className="w-[3px] flex-1 bg-border mt-1" />
      </div>
      <div
        className=" py-3  flex flex-col items-center flex-1"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        <div
          className="flex items-center w-full gap-1 overflow-hidden"
          data-testid="tweet-header-add-reply"
          style={{
            maxWidth: '100%',
          }}
        >
          <span className="font-bold truncate max-w-[30%]">{data?.name}</span>
          <span className="text-gray-500 truncate max-w-[30%]">
            @{data?.username}
          </span>
          <span className="text-gray-500">·</span>
          <div className="flex-shrink-0">
            <Timing time={data?.date} hover={false} />
          </div>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            wordBreak: 'break-word',
          }}
        >
          <Content
            content={content}
            isQuote={tweet.isQuote}
            data={quoteData}
            isInModal={true}
          />
        </div>
        {isReply && (
          <div className="w-full mt-3">
            <span className="text-gray-400 text-md">Replying to </span>
            <span className="text-blue-400 text-md">@{data?.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}
