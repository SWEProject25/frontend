'use client';

import { useState } from 'react';
import Tabs from '@/components/generic/Tabs';
import Avatar from '@/components/generic/Avatar';
import { XLogo } from '@/components/ui/icons/BrandIcons';
import { FOLLOWING_TAB, FOR_YOU_TAB } from '../constants/menuName';
import {
  useActions,
  useSelectedTab,
  useTabsScroll,
} from '../store/useTimelineStore';
import { useMyProfile } from '@/features/profile/hooks';
import MobileSidebar from '@/features/layout/components/MobileSidebar';
import { useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS } from '../hooks/timelineQueries';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedTab = useSelectedTab();
  const {
    selectTab,
    setFetchAvatars,
    setNewTweets,
    setPopUpAvatars,
    setTabsScroll,
  } = useActions();
  const { data: profileData } = useMyProfile();
  const queryClient = useQueryClient();
  const tabs = [
    { title: 'For you', value: FOR_YOU_TAB },
    { title: 'Following', value: FOLLOWING_TAB },
  ];

  const profile = profileData?.data;
  const tabsScroll = useTabsScroll();
  function handleClickTab(value: string) {
    const oldScroll = document.documentElement.scrollTop;
    if (value === selectedTab) window.scrollTo({ top: 0, behavior: 'smooth' });
    else {
      let scroll;
      if (selectedTab === FOR_YOU_TAB) {
        setTabsScroll([oldScroll, tabsScroll[1]]);
        scroll = tabsScroll[1];
      } else {
        setTabsScroll([tabsScroll[0], oldScroll]);
        scroll = tabsScroll[0];
      }
      window.scrollTo({ top: scroll, behavior: 'smooth' });
    }

    selectTab(value);

    const queryKey =
      value === FOR_YOU_TAB
        ? TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
        : TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;

    queryClient.refetchQueries({ queryKey: queryKey });
    setFetchAvatars(false);
    setNewTweets([]);
    setPopUpAvatars([]);
  }

  //left-[calc(50%-300px)]
  return (
    <>
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <header
        data-testid="timeline-header"
        className="z-10 flex flex-col sticky top-0 w-full bg-background/50 backdrop-blur-md"
      >
        <div className="xs:hidden flex items-center justify-between px-4 py-2 border-b border-border">
          <div onClick={() => setIsSidebarOpen(true)}>
            <Avatar
              avatarImage={profile?.profile_image_url ?? null}
              name={profile?.name ?? 'User'}
              size="xs"
              position="relative"
              className="border-0 cursor-pointer"
              data-testid="timeline-mobile-avatar"
            />
          </div>
          <XLogo className="w-7 h-7" data-testid="timeline-mobile-logo" />
          <div className="w-8 h-8" />
        </div>

        <Tabs
          data-testid="timeline-tabs"
          height="h-[53px]"
          selectedValue={selectedTab}
          tabs={tabs}
          onClick={handleClickTab}
        />
      </header>
    </>
  );
}
