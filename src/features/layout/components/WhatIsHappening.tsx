'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTrendingHashtags } from '../hooks/useTrendingHashtags';
import XLoader from '@/components/generic/XLoader';

export default function WhatIsHappening() {
  const { data: hashtagsResponse, isLoading } = useTrendingHashtags(5);
  const router = useRouter();

  const trendingHashtags = Array.isArray(hashtagsResponse?.data?.trending)
    ? hashtagsResponse.data.trending
    : [];

  const trends = trendingHashtags.map((hashtag) => ({
    category: hashtagsResponse?.metadata?.category || 'Trending',
    hashtag: hashtag.tag.startsWith('#') ? hashtag.tag : `#${hashtag.tag}`,
    posts: `${hashtag.totalPosts.toLocaleString()} posts`,
    rawTag: hashtag.tag,
  }));

  const handleTrendClick = (tag: string) => {
    const params = new URLSearchParams({
      q: tag,
    });
    router.push(`/search?${params}`);
  };

  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-3 text-white">
        What&apos;s happening
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <XLoader />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {trends.map((trend, i) => (
              <div
                key={i}
                className="hover:bg-[#1D1F23] p-2 rounded-xl cursor-pointer transition-colors"
                onClick={() => handleTrendClick(trend.rawTag)}
              >
                <p className="text-gray-500 text-sm">{trend.category}</p>
                <p className="font-bold text-white text-sm">{trend.hashtag}</p>
                {trend.posts && (
                  <p className="text-gray-500 text-sm">{trend.posts}</p>
                )}
              </div>
            ))}
          </div>
          <Link
            href="/explore/tabs/general"
            className="text-blue-400 hover:underline mt-3 text-sm block"
          >
            Show more
          </Link>
        </>
      )}
    </div>
  );
}
