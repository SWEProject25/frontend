import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuoteTweet from './QuoteTweet';

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
  tweetContent: TweetContent;
  avatar: string | null;
  name: string;
  username: string;
  isVerified: boolean;
  date: string;
};

export default function Content({
  content,
  isQuote = false,
  data = undefined,
}: {
  content: TweetContent;
  isQuote?: boolean;
  data?: quoteProps;
}) {
  return (
    <div
      className="w-full"
      data-testid="tweet-content"
      style={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        wordBreak: 'break-word',
      }}
    >
      {/* Render mentions inline with text */}
      <div className="text-gray-200 text-left">
        {content.mentions && content.mentions.length > 0 && (
          <span className="inline-flex flex-wrap gap-1 mr-1">
            {content.mentions.map((mention, index) => (
              <Link
                key={index}
                href={`/${mention.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-blue-400 hover:underline text-sm"
              >
                @{mention.username}
              </Link>
            ))}
          </span>
        )}
        {content.text && (
          <span data-testid="tweet-text" className="inline">
            {content.text}
          </span>
        )}
      </div>

      {content.media && content.media.length > 0 && (
        <div
          className="mt-3 grid grid-cols-1 gap-3 w-full"
          data-testid="tweet-media"
        >
          {content.media.map((item, idx) =>
            item.type.toLocaleLowerCase() === 'image' ? (
              <div
                key={idx}
                data-testid={`tweet-image-${idx}`}
                className="rounded-xl overflow-auto relative h-70 w-full"
              >
                <Image
                  fill
                  src={item.url}
                  alt="Tweet image"
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            ) : item.type.toLocaleLowerCase() === 'video' ? (
              <div
                key={idx}
                data-testid={`tweet-video-${idx}`}
                className="rounded-xl overflow-auto relative w-full"
              >
                <video
                  controls
                  className="w-full h-auto rounded-xl object-cover"
                  src={item.url}
                />
              </div>
            ) : null
          )}
        </div>
      )}
      {isQuote && (
        <div className="mt-3 p-3 border border-gray-700 rounded-xl">
          {data && <QuoteTweet {...data} />}
        </div>
      )}
    </div>
  );
}
