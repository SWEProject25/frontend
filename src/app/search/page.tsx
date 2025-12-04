'use client';
import SearchTweets from '@/features/explore/components/SearchTweets';
import SearchHeader from '@/features/explore/components/SearchHeader';
import { LATEST_TAB, TOP_TAB } from '@/features/explore/constants/tabs';
import { useActions } from '@/features/explore/store/useExploreStore';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const params = useSearchParams();
  const query = decodeURIComponent(params?.get('q') ?? '');
  const searchTab = params?.get('f');
  const { selectSearchTab, setSearchQuery } = useActions();
  const { setSearch, setSearchDate } = useActions();

  useEffect(
    function () {
      if (query?.trim()) {
        const tab = searchTab === 'live' ? LATEST_TAB : TOP_TAB;
        selectSearchTab(tab);
        setSearch(query);
        setSearchQuery(query);
        setSearchDate(new Date().toISOString());
      }
    },
    [
      query,
      searchTab,
      setSearch,
      setSearchDate,
      setSearchQuery,
      selectSearchTab,
    ]
  );
  if (!query?.trim()) {
    return redirect('/explore');
  }

  return (
    <>
      <SearchHeader />
      <SearchTweets />
    </>
  );
}
