'use client';
import Tabs from '@/components/generic/Tabs';
import { userTabs, myTabs, MEDIA_TAB, REPLIES_TAB } from '../constants/tabs';
import { useActions, useSelectedTab } from '../store/profileStore';
import BlockedByUserNotice from './BlockedByUserNotice';
import Tweets from './Tweets';
import { useAuthStore } from '@/features/authentication/store/authStore';
import MediaTweets from './MediaTweets';
import { useProfileContext } from '@/app/[username]/ProfileProvider';
import RepliesList from './RepliesList';

const TabView = () => {
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const { profile } = useProfileContext();

  const myProfile = useAuthStore((state) => state.user);
  const tabs = myProfile?.id === profile?.User.id ? myTabs : userTabs;
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
      {profile?.User &&
        (selectedTab !== MEDIA_TAB ? (
          selectedTab === REPLIES_TAB ? (
            <RepliesList />
          ) : (
            <Tweets />
          )
        ) : (
          <MediaTweets />
        ))}
    </div>
  );
};

export default TabView;
