import React from 'react';
import Tweet from '../../features/tweets/components/Tweet';
function Page() {
  const time = new Date(Date.now() - 250 * 30 * 10 * 100 * 1000 * 60);
  const data = {
    user: {
      name: 'Omda Hancker',
      username: '@mohamedemad',
      avatar: '/apple.png',
      isVerified: true,
    },
    tweet: {
      id: '1',
      text: 'Tweet content goes here. This is a sample tweet to demonstrate the layout.',
      image: '/Personal photo.jpeg',
      time: time,
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
  return (
    <>
      <Tweet data={data} />
      <Tweet data={data} />
      <Tweet data={data} />
      <Tweet data={data} />
    </>
  );
}

export default Page;
