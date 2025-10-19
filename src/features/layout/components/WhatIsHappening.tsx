import React from 'react';

export default function WhatIsHappening() {
  const trends = [
    {
      category: 'Fashion & beauty · Trending',
      hashtag: 'بوفون',
      posts: '1,012 posts',
    },
    { category: 'Trending in Egypt', hashtag: '#الماجد_للعود', posts: '' },
    {
      category: 'Trending in Egypt',
      hashtag: 'صاعد على المدى القصير',
      posts: '',
    },
    {
      category: 'Trending in Egypt',
      hashtag: 'الفردوس الاعلى',
      posts: '5,842 posts',
    },
  ];
  return (
    <div className="bg-black rounded-2xl p-4 border border-gray-700">
      <h2 className="text-xl font-bold mb-3 text-white">
        What&apos;s happening
      </h2>
      <div className="space-y-2">
        {trends.map((trend, i) => (
          <div
            key={i}
            className="hover:bg-[#1D1F23] p-2 rounded-xl cursor-pointer transition-colors"
          >
            <p className="text-gray-500 text-sm">{trend.category}</p>
            <p className="font-bold text-white text-sm">{trend.hashtag}</p>
            {trend.posts && (
              <p className="text-gray-500 text-sm">{trend.posts}</p>
            )}
          </div>
        ))}
      </div>
      <button className="text-blue-400 hover:underline mt-3 text-sm">
        Show more
      </button>
    </div>
  );
}
