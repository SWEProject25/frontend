'use client';
import Tabs from '@/components/generic/Tabs';
import { tabs } from '../constants/tabs';
import {
  useActions,
  useProfileStore,
  useSelectedTab,
} from '../store/profileStore';
import BlockedByUserNotice from './BlockedByUserNotice';

const TabView = () => {
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const profile = useProfileStore((state) => state.currentProfile);
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
      {profile?.is_been_blocked && (
        <BlockedByUserNotice username={profile.User.username} />
      )}
      {/* {profile?.User && <Tweets />} */}
    </div>
  );
};

export default TabView;
