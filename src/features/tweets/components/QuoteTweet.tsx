'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UserInfo from './UserInfo';
import Timing from './Timing';
import Content from './Content';
import TweetAvatar from './TweetAvatar';

type MediaItem = {
  url: string;
  type: string | 'image' | 'video';
};

type mention = {
  userId: number;
  username: string;
};

type TweetContent = {
  text?: string;
  media?: MediaItem[];
  mentions?: mention[];
};
type quoteProps = {
  postId: number;
  userId: number;
  tweetContent: TweetContent;
  avatar: string | null;
  name: string;
  username: string;
  isVerified: boolean;
  date: string;
  isInModal?: boolean;
  isDeleted?: boolean;
};

export default function QuoteTweet(data: quoteProps) {
  const [Hovered, setHovered] = useState(false);
  const router = useRouter();

  const user = {
    id: data.userId,
    name: data.name,
    username: data.username,
    verified: data.isVerified,
    avatar: data.avatar,
  };
  const isDeleted = data.isDeleted;
  if (isDeleted) {
    return (
      <div
        data-testid={`tweet-${data.postId}`}
        className={`block mx-auto p-3 border border-gray-300/10 rounded-xl w-full text-white relative bg-gray-300/10`}
        style={{
          boxSizing: 'border-box',
          maxWidth: '100%',
          overflow: 'visible',
        }}
      >
        <div className="flex w-full gap-2">
          <div className="flex flex-col flex-1 min-w-0">
            <div
              className="flex items-center justify-between w-full"
              data-testid="tweet-header"
              style={{ maxWidth: '100%' }}
            >
              <div className="flex items-center gap-1">
                <span className="text-gray-400">This tweet is unavailable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`tweet-${data.postId}`}
      onClick={
        data.isInModal
          ? (e) => e.stopPropagation()
          : (e) => {
              e.stopPropagation();
              router.push(`/home/${data.postId}`);
            }
      }
      className={`block mx-auto p-3 border border-gray-700 rounded-xl w-full text-white relative transition-colors ${!data.isInModal && !Hovered ? 'hover:bg-[#1a1a1a] hover:cursor-pointer' : ''}`}
      style={{ boxSizing: 'border-box', maxWidth: '100%', overflow: 'visible' }}
    >
      <div className="flex w-full gap-2">
        <TweetAvatar
          data={user}
          onHoverCard={setHovered}
          cardShow={!data.isInModal}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className="flex items-center justify-between w-full"
            data-testid="tweet-header"
            style={{ maxWidth: '100%' }}
          >
            <div className="flex items-center gap-1">
              <UserInfo data={user} cardShow={!data.isInModal} />
              <span className="text-gray-500">·</span>
              <Timing time={data.date} hover={!data.isInModal} />
            </div>
          </div>
          <Content content={data.tweetContent} />
        </div>
      </div>
    </div>
  );
}
