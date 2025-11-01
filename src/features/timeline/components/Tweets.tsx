import Tweet from '@/features/tweets/components/Tweet';
export default function Tweets() {
  const time = new Date(Date.now() - 250 * 30 * 10 * 100 * 1000 * 60);
  const data = {
    id: '1',
    content: {
      text: ' tweet to demonstrate the layout.',
      media: [{ url: '/Personal photo.jpeg', type: 'image' }],
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
  const data2 = {
    ...data,
    id: '2',
    content: {
      ...data.content,
      media: [{ url: '/apple.png', type: 'image' }],
    },
  };
  const data3 = {
    ...data,
    id: '3',
    content: {
      ...data.content,
      media: [{ url: '/taher1.jpg', type: 'image' }],
    },
  };

  return (
    <div className="w-full">
      <Tweet data={data} />
      <Tweet data={data2} />
      <Tweet data={data3} />
    </div>
  );
}
