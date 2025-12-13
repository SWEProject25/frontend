'use client';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { useTrendingFeed } from '../hooks/exploreQueries';
import Trend from './Trend';
import { Loader } from '@/components/generic';
import React from 'react';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import { useRouter } from 'next/navigation';

export default function Trendings() {
  const { data, error, isError, isLoading } = useTrendingFeed();
  const router = useRouter();
  console.log(data?.metadata.HashtagsCount);
  const renderTrends = data?.data.trending.map((trend, ind) => (
    <Trend
      data-testid={`explore-feed-trend-${trend.tag}`}
      category={data.metadata.category}
      data={trend}
      key={ind}
      indx={ind + 1}
      onClick={() => {
        const params = new URLSearchParams({
          q: `${trend.tag}`,
        });

        router.push(`/search?${params}`);
      }}
    />
  ));

  return isError ? (
    <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="explore-feed-trending-list-loading"
    >
      <Loader />
    </div>
  ) : (
    <div
      className="flex flex-col w-full  "
      data-testid="explore-feed-render-trending-list"
    >
      {data?.metadata.HashtagsCount ? (
        renderTrends
      ) : (
        <div className="w-full h-64 flex justify-center items-center text-center">
          <span>Trends are not available yet</span>
        </div>
      )}
    </div>
  );
}
