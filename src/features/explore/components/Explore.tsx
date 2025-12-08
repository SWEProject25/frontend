import { FOR_YOU_TAB } from '../constants/tabs';
import { useSelectedTab } from '../store/useExploreStore';
import Trendings from './Trendings';
import TweetsList from './TweetsList';

export default function Explore() {
  const selectedTab = useSelectedTab();
  return <>{selectedTab === FOR_YOU_TAB ? <TweetsList /> : <Trendings />}</>;
}
