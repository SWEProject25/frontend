'use client';
import { useProfileMedia } from '../hooks/profileQueries';
import Tweet from '@/features/tweets/components/Tweet';
import Loader from '@/components/generic/Loader';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import React, { useState } from 'react';
import Image from 'next/image';
import Video from '@/features/media/components/Video';
import { MediaFeed } from '../types/api';
import { formatVideoTime } from '@/features/media/utils/formatVideoTime';

type videoDuration = {
  id: number;
  duration: string;
};
export default function MediaTweets() {
  const [videodDuration, setVideoDuration] = useState<videoDuration[]>([]);
  function handleDuration(
    e: React.SyntheticEvent<HTMLVideoElement>,
    media: MediaFeed
  ) {
    const video = e.currentTarget as HTMLVideoElement;
    if (!video) return;
    setVideoDuration((videos) => [
      ...videos,
      {
        id: media.id,
        duration: formatVideoTime(video.duration),
      },
    ]);
  }
  const {
    data,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useProfileMedia();
  const pages = data?.pages.flat();
  const renderMedia = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.map((media, ind) => (
        <div key={media.id} className={`relative  aspect-square bg-black `}>
          {media.type.toLowerCase() === 'image' ? (
            <Image
              data-testid={`image-${media.id}`}
              fill
              className="object-cover rounded-2xl cursor-pointer"
              src={media.media_url}
              sizes="(max-width: 640px) 100vw, 514px"
              alt={`media`}
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                data-testid={`video-${media.id}`}
                className="w-full h-full rounded-2xl object-cover cursor-pointer bg-black"
                //   muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => handleDuration(e, media)}
                src={media.media_url}
                //   loop
                //   preload="none"
                //   autoPlay={false}
                //   poster={media.media_url}
              >
                {/* <source src={media.media_url} type={media.type}></source> */}
              </video>
              <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {
                  videodDuration.find((video) => video.id === media.id)
                    ?.duration
                }
              </div>
            </div>
          )}
        </div>
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.length > 0 : false;
  return isError ? (
    <div data-testid="profile-tweets-error">Error {error.message}</div>
  ) : isLoading ? (
    <div
      className="flex justify-center items-center h-64 mx-4"
      data-testid="profile-tweets-loading"
    >
      <Loader />
    </div>
  ) : (
    <InfiniteScroll
      data-testid="profile-tweets-list"
      isLoadingInitial={isLoading}
      isLoadingMore={isFetchingNextPage}
      loadMore={() => hasNextPage && fetchNextPage()}
      hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
      hasInitialData={hasInitialData}
      noDataMessage="No Media"
    >
      <div className="grid grid-cols-3  p-1 gap-2 w-full">{renderMedia} </div>
    </InfiniteScroll>
  );
}
