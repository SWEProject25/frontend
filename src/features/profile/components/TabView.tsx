'use client';
import Tabs from '@/components/generic/Tabs';
import { myTabs, userTabs } from '../constants/tabs';
import {
  useActions,
  useProfileStore,
  useSelectedTab,
} from '../store/profileStore';
import Tweets from './Tweets';
import { useAuth } from '@/features/authentication/hooks';

const TabView = () => {
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const profile = useProfileStore((state) => state.currentProfile);
  const user = useAuth().user?.id;
  const tabs = user === profile?.User.id ? myTabs : userTabs;
  // console.log(profile?.User.id);
  return (
    <div className="w-full mt-4" data-testid="profile-tab-view">
      <Tabs
        data-testid="profile-tabs"
        tabs={tabs}
        selectedValue={selectedTab}
        onClick={selectTab}
        height="h-[53px]"
      />
      {profile?.User && <Tweets />}
    </div>
  );
};

export default TabView;
