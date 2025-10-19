import AddTweet from './AddTweet';
import Header from './Header';
import ShowTweets from './ShowTweets';
import Tweets from './Tweets';

export default function Timeline() {
  return (
    <div className="flex flex-col w-full min-h-screen  border-r-1 border-r-gray-500 ">
      <Header />
      <main className="flex-col w-full min-h-screen justify-items-center  ">
        <AddTweet />
        <ShowTweets />
        <Tweets />
      </main>
    </div>
  );
}
