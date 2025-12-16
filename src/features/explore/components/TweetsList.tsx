'use client';

import { useExplorePosts } from '../hooks/exploreQueries';
import React from 'react';
import Tweet from '@/features/tweets/components/Tweet';

import Loader from '@/components/generic/Loader';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import Icon from '@/components/ui/home/Icon';
import { useRouter } from 'next/navigation';

export default function TweetsList() {
  const { data, error, isError, isLoading } = useExplorePosts();
  const router = useRouter();

  if (isLoading)
    return (
      <div
        className="flex justify-center items-center h-64 mx-4"
        data-testid="explore-feed-tweet-list-loading"
      >
        <Loader />
      </div>
    );
  else if (!data)
    return (
      <div className="flex -flex-1 justify-center items-center text-center">
        No Posts available Right Now
      </div>
    );

  const categries = Object.keys(data.data);
  const categoryPosts = data.data;
  console.log(categries, data, categoryPosts);
  categries.forEach((category) => console.log(categoryPosts[category]));
  const renderCategries = categries.map((category, i) => (
    <React.Fragment key={i}>
      <div
        className=" border-border border-t-2  hover:bg-input-bg-hover/80 transition-colors cursor-pointer p-4 flex min-h-12 w-full flex-1 justify-center items-center"
        onClick={() => router.push(`/interests/${category}`)}
      >
        <div className="flex flex-1 min-h-5 w-full  font-bold text-xl text-white ">
          {category}
        </div>
        <div>
          <Icon
            path="M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z"
            color="text-white"
            disabled={true}
          />
        </div>
      </div>
      {categoryPosts[category].map((tweet, ind) => (
        <Tweet
          data-testid={`explore-feed${tweet.userId}${tweet.postId}${tweet.date}`}
          data={tweet}
          key={ind}
        />
      ))}
    </React.Fragment>
  ));

  return isError ? (
    <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="explore-feed-tweet-list-loading"
    >
      <Loader />
    </div>
  ) : (
    <>
      <div
        className="flex flex-col w-full"
        data-testid="explore-feed-render-tweet-list"
      >
        {renderCategries}
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium"></p>
          <div className="mt-2 h-1 w-24 bg-linear-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent rounded-full"></div>
        </div>
      </div>
    </>
  );
}
