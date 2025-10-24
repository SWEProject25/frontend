import React from 'react';
import FullTweet from '../../features/tweets/components/FullTweet';

function Page() {
  const time = new Date(Date.now() - 250 * 30 * 10 * 100 * 1000 * 60);
  const data = {
    id: '1',
    content: {
      text: 'Tweet content goes here. This is a sample tweet to demonstrate the layout.',
      image: '/Personal photo.jpeg',
    },
    user: {
      name: 'Omda Hancker',
      username: '@mohamedemad',
      avatar: '/apple.png',
      bio: 'Developer at XYZ. Love coding and coffee.',
      following: 150,
      followers: '2.5K',
      isVerified: true,
      isFollowed: false,
    },
    time: time,
    Actions: {
      replies: 2,
      retweets: 4,
      likes: 24,
      bookmarks: 10,
      views: '1.5K',
      booked: true,
      shared: false,
      liked: false,
      reposted: false,
    },
  };

  const replyData = {
    id: '2',
    content: {
      text: 'This is a reply to the original tweet.',
      image: '',
    },
    user: {
      name: 'Omda Hancker',
      username: '@mohamedemad',
      avatar: '/apple.png',
      bio: 'Developer at XYZ. Love coding and coffee.',
      following: 150,
      followers: '2.5K',
      isVerified: true,
      isFollowed: false,
    },
    time: time,
    Actions: {
      replies: 2,
      retweets: 4,
      likes: 24,
      bookmarks: 10,
      views: '1.5K',
      booked: true,
      shared: false,
      liked: false,
      reposted: false,
    },
  };

  return (
    <>
      <FullTweet data={data} reply={replyData} />
    </>
  );
}

export default Page;
