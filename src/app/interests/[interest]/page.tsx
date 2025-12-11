'use client';

import Interest from '@/features/explore/components/Interest';
import InterestHeader from '@/features/explore/components/InterestHeader';
import { TOP_TAB } from '@/features/explore/constants/tabs';
import { useActions } from '@/features/explore/store/useExploreStore';
import React, { useEffect } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ interest: string }>;
}) {
  const { selectInterestTab, setInterest } = useActions();
  const { interest } = React.use(params);
  useEffect(
    function () {
      selectInterestTab(TOP_TAB);
      console.log(interest);
      setInterest(interest);
    },
    [setInterest, selectInterestTab, interest]
  );

  return (
    <>
      <InterestHeader />
      <Interest />
    </>
  );
}
