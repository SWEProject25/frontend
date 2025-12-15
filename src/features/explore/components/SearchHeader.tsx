'use client';

import Tabs from '@/components/generic/Tabs';
import {
  useActions,
  useSearch,
  useSelectedSearchTab,
} from '../store/useExploreStore';
import { searchTabs, TOP_TAB } from '../constants/tabs';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';

export default function SearchHeader() {
  const selectedTab = useSelectedSearchTab();
  const { selectSearchTab: setSelectedTab } = useActions();
  const router = useRouter();
  const search = useSearch();
  const selectTab = (tab: string) => {
    const params =
      tab === TOP_TAB
        ? new URLSearchParams({
            q: `${search}`,
          })
        : new URLSearchParams({
            q: `${search}`,
            f: 'live',
          });
    router.push(`/search?${params}`);
    setSelectedTab(tab);
  };
  return (
    <header
      data-testid="timeline-explore-search-header"
      className="z-10 flex-col flex sticky top-0 w-full bg-black/50 backdrop-blur-md"
    >
      <SearchBar />

      <Tabs
        data-testid="timeline-explore-search-tabs"
        height="h-[53px]"
        selectedValue={selectedTab}
        tabs={searchTabs}
        onClick={selectTab}
      />
    </header>
  );
}
