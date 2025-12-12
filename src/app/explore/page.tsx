'use client';
import Explore from '@/features/explore/components/Explore';
import Header from '@/features/explore/components/Header';
import { FOR_YOU_TAB } from '@/features/explore/constants/tabs';
import { useActions } from '@/features/explore/store/useExploreStore';
import { useEffect } from 'react';

export default function Page() {
  const { selectTab, setSearchQuery } = useActions();

  useEffect(
    function () {
      setSearchQuery('');
      selectTab(FOR_YOU_TAB);
    },
    [setSearchQuery, selectTab]
  );

  return (
    <>
      <Header />
      <Explore />
    </>
  );
}
