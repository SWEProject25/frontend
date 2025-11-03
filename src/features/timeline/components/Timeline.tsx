import AddTweet from './AddTweet';
import Header from './Header';
import ShowTweets from './ShowTweets';
// import TweetFeed from './TweetFeed';
import TweetList from './TweetList';

export default function Timeline() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className="flex-col justify-items-center w-full">
        <AddTweet />
        <ShowTweets />
        {/* <TweetFeed /> */}
        <TweetList />
        {/* <Tweets /> */}
      </div>
    </div>
  );
}
