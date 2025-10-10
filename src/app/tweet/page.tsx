import React from 'react';
import Header from '../../features/tweets/components/Header';
import Content from '../../features/tweets/components/Content';
import Actions from '../../features/tweets/components/Actions';
import { FaEllipsisH } from 'react-icons/fa';

const data = {
  user: {
    name: 'Omda Hancker',
    username: '@mohamedemad',
    avatar: '/apple.png',
    isVerified: true,
  },
  tweet: {
    text: 'Tweet content goes here. This is a sample tweet to demonstrate the layout.',
    image: '/Personal photo.jpeg',
    stats: {
      replies: 2,
      retweets: 4,
      likes: 24,
      views: '1.5K',
      saved: true,
      shared: false,
    },
  },
};
function Page() {
  return (
    <div className="max-w-xl mx-auto border-b border-gray-700 p-4 text-white relative">
      <button
        type="button"
        className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 transition-colors"
        aria-label="Tweet details"
      >
        <FaEllipsisH size={18} />
      </button>
      <div className="flex gap-3">
        <Header image={data.user.avatar} />
        <div className="flex flex-col flex-1">
          <Content
            text={data.tweet.text}
            image={data.tweet.image}
            name={data.user.name}
            username={data.user.username}
            isVerified={data.user.isVerified}
          />
          <Actions stats={data.tweet.stats} />
        </div>
      </div>
    </div>
  );
}

export default Page;
