'use client';
import Explore from '@/features/explore/components/Explore';
import Header from '@/features/explore/components/Header';
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
  selectTab(tab);
  return (
    <>
      <Header />
      <Explore />
    </>
  );
}
