'use client';

import Tabs from '@/components/generic/Tabs';
import { FOLLOWING_TAB, FOR_YOU_TAB } from '../constants/menuName';
import { useActions, useSelectedTab } from '../store/useTimelineStore';

export default function Header() {
  const selectedTab = useSelectedTab();
  const { selectTab } = useActions();
  const tabs = [
    { title: 'For you', value: FOR_YOU_TAB },
    { title: 'Following', value: FOLLOWING_TAB },
  ];

  //left-[calc(50%-300px)]
  return (
    <header
      data-testid="timeline-header"
      className="z-10 flex sticky top-0 w-full bg-black/50 backdrop-blur-md"
    >
      <Tabs
        data-testid="timeline-tabs"
        height="h-[53px]"
        selectedValue={selectedTab}
        tabs={tabs}
        onClick={selectTab}
      />
    </header>
  );
}
