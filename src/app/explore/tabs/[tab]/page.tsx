'use client';
import Explore from '@/features/explore/components/Explore';
import Header from '@/features/explore/components/Header';
import { exploreTabs, FOR_YOU_TAB } from '@/features/explore/constants/tabs';
import { useActions } from '@/features/explore/store/useExploreStore';
import React, { useEffect } from 'react';

export default function Page({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = React.use(params);
  const { selectTab, setSearchQuery } = useActions();
  useEffect(
    function () {
      setSearchQuery('');
    },
    [setSearchQuery]
  );

  if (exploreTabs.filter((tabs) => tabs.value === tab).length) selectTab(tab);
  else {
    selectTab(FOR_YOU_TAB);
  }
  return (
    <>
      <Header />
      <Explore />
    </>
  );
}
