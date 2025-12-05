'use client';

import { useState } from 'react';
import Tabs from '@/components/generic/Tabs';
import Avatar from '@/components/generic/Avatar';
import { XLogo } from '@/components/ui/icons/BrandIcons';
import { FOLLOWING_TAB, FOR_YOU_TAB } from '../constants/menuName';
import { useActions, useSelectedTab } from '../store/useTimelineStore';
import { useMyProfile } from '@/features/profile/hooks';
import MobileSidebar from '@/features/layout/components/MobileSidebar';

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const { data: profileData } = useMyProfile();

  const tabs = [
    { title: 'For you', value: FOR_YOU_TAB },
    { title: 'Following', value: FOLLOWING_TAB },
  ];

  const profile = profileData?.data;

  //left-[calc(50%-300px)]
  return (
    <>
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <header
        data-testid="timeline-header"
        className="z-10 flex flex-col sticky top-0 w-full bg-black/50 backdrop-blur-md"
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
          onClick={selectTab}
        />
      </header>
    </>
  );
}
