import { FOR_YOU_TAB } from '../constants/tabs';
import { useSelectedTab } from '../store/useExploreStore';
import ForYou from './ForYou';
import Trendings from './Trendings';

export default function Explore() {
  const selectedTab = useSelectedTab();
  return <>{selectedTab === FOR_YOU_TAB ? <ForYou /> : <Trendings />}</>;
}
