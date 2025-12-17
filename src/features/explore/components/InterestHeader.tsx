'use client';

import Tabs from '@/components/generic/Tabs';
import {
  useActions,
  useInterest,
  useSelectedInterestTab,
} from '../store/useExploreStore';
import { InterestTabs } from '../constants/tabs';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/home/Icon';

export default function InterestHeader() {
  const selectedTab = useSelectedInterestTab();
  const interest = useInterest();
  const { selectInterestTab: setSelectedTab } = useActions();
  const router = useRouter();
  const selectTab = (tab: string) => {
    router.push(`/interests/${interest}/${tab}`);
    setSelectedTab(tab);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-row min-h-10 p-3.5 text-white font-bold text-2xl">
        <div>
          <Icon
            onClick={() => router.back()}
            color="text-white"
            hoverColor="bg-input-bg-hover/90"
            size="w-4 h-4"
            path="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
          />
        </div>
        <span className="pl-5">Interest</span>
      </div>
      <div className="min-h-10 p-3.5  text-white font-extrabold text-3xl">
        {' '}
        {interest}
      </div>
      <div>
        <span className="text-text-inactive pl-3.5">
          {' '}
          Posts about the Interests you follow show up in your Home Timeline
        </span>
      </div>
      <header
        data-testid="timeline-explore-header"
        className="z-10 flex-col flex sticky top-0 w-full bg-black/50 backdrop-blur-md"
      >
        <Tabs
          data-testid="timeline-explore-tabs"
          height="h-[53px]"
          selectedValue={selectedTab}
          tabs={InterestTabs}
          onClick={selectTab}
        />
      </header>
    </div>
  );
}
