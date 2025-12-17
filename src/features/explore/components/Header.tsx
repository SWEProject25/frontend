'use client';

import Tabs from '@/components/generic/Tabs';
import { useActions, useSelectedTab } from '../store/useExploreStore';
import { exploreTabs } from '../constants/tabs';
import { useRouter } from 'next/navigation';
import SearchProfile from '@/features/timeline/components/SearchProfile';

export default function Header() {
  const selectedTab = useSelectedTab();
  const { selectTab: setSelectedTab } = useActions();
  const router = useRouter();
  const selectTab = (tab: string) => {
    router.push(`/explore/tabs/${tab}`);
    setSelectedTab(tab);
  };
  return (
    <header
      data-testid="timeline-explore-header"
      className="z-10 flex-col flex sticky top-0 w-full bg-black/50 backdrop-blur-md"
    >
      <div className="px-3 pt-0.5 pb-1 w-full">
        <SearchProfile />
      </div>

      <Tabs
        data-testid="timeline-explore-tabs"
        height="h-[53px]"
        selectedValue={selectedTab}
        tabs={exploreTabs}
        onClick={selectTab}
      />
    </header>
  );
}
