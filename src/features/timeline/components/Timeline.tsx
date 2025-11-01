import AddTweet from './AddTweet';
import Header from './Header';
import ShowTweets from './ShowTweets';
import TweetFeed from './TweetFeed';
import TweetList from './TweetList';
import Tweets from './Tweets';

export default function Timeline() {
  return (
    <div className="flex flex-col w-full ">
      <Header />
      <div className="flex-col w-full justify-items-center pt-14">
        <AddTweet />
        <ShowTweets />
        {/* <TweetFeed /> */}
        <TweetList />
        {/* <Tweets /> */}
      </div>
    </div>
  );
}
