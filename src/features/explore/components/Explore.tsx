import { FOR_YOU_TAB } from '../constants/tabs';
import { useSelectedTab } from '../store/useExploreStore';
import ForYou from './ForYou';
import Trendings from './Trendings';
import { Suspense } from 'react';
import Loader from '@/components/generic/Loader';

export default function Explore() {
  const selectedTab = useSelectedTab();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64 mx-4">
          <Loader />
        </div>
      }
    >
      {selectedTab === FOR_YOU_TAB ? <ForYou /> : <Trendings />}
    </Suspense>
  );
}
