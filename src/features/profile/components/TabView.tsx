'use client';
import Tabs from '@/components/generic/Tabs';
import { tabs } from '../constants/tabs';
import {
  useActions,
  useProfileStore,
  useSelectedTab,
} from '../store/profileStore';
import Tweets from './Tweets';

const TabView = () => {
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const profile = useProfileStore((state) => state.currentProfile);
  console.log(profile?.User.id);
  return (
    <div className="w-full mt-4">
      <Tabs
        tabs={tabs}
        selectedValue={selectedTab}
        onClick={selectTab}
        height="h-[53px]"
      />
      {/* <Tweets /> */}
    </div>
  );
};

export default TabView;
