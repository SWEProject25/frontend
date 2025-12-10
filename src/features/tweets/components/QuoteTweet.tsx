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
};
export default function QuoteTweet(data: quoteProps) {
  const [Hovered, setHovered] = useState(false);
  const router = useRouter();

  const user = {
    id: data.userId, // You may need to pass userId in quoteProps
    name: data.name,
    username: data.username,
    verified: data.isVerified,
    avatar: data.avatar,
  };

  return (
    <div
      data-testid={`tweet-${data.postId}`}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/home/${data.postId}`);
      }}
      className={`block mx-auto p-3 border border-gray-700 rounded-xl w-full text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0f0f0f]' : ''} hover:cursor-pointer`}
      style={{ boxSizing: 'border-box', maxWidth: '100%' }}
    >
      <div className="flex w-full gap-2">
        <TweetAvatar data={user} onHoverCard={setHovered} />
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className="flex items-center justify-between w-full"
            data-testid="tweet-header"
            style={{ maxWidth: '100%' }}
          >
            <div className="flex items-center gap-1">
              <UserInfo data={user} onHoverCard={setHovered} />
              <span className="text-gray-500">·</span>
              <Timing time={data.date} hover={true} />
            </div>
          </div>
          <Content content={data.tweetContent} />
        </div>
      </div>
    </div>
  );
}
