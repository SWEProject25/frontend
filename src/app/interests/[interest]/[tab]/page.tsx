'use client';
import Interest from '@/features/explore/components/Interest';
import InterestHeader from '@/features/explore/components/InterestHeader';
import { InterestTabs, TOP_TAB } from '@/features/explore/constants/tabs';
import { useActions } from '@/features/explore/store/useExploreStore';
import React, { useEffect } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ interest: string; tab: string }>;
}) {
  const { tab, interest } = React.use(params);
  const { selectInterestTab, setInterest } = useActions();
  console.log(params);
  useEffect(
    function () {
      setInterest(interest);
      if (InterestTabs.filter((tabs) => tabs.value === tab).length)
        selectInterestTab(tab);
      else {
        selectInterestTab(TOP_TAB);
      }
      console.log(tab);
    },
    [interest, setInterest, selectInterestTab, tab]
  );
  return (
    <>
      <InterestHeader />
      <Interest />
    </>
  );
}
