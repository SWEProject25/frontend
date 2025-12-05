'use client';
import XModal from '@/components/ui/hoc/XModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useGifACtions,
  useGifsSearch,
  useGifVisibility,
} from '../store/useGif';
import useMedia, { useMediaActions } from '@/features/media/store/useMedia';
import { gifApi } from '../services/gifAPi';
import { gifs } from '../constants/data';
import { CATERGORIES } from '../constants/api';
import Icon from '@/components/ui/home/Icon';
import { SearchInput } from '@/components/ui/input';
import { useSearchCategories, useSearchGif } from '../hooks/mediaQueries';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import { Loader } from '@/components/generic';
import React, { useState } from 'react';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import GifData from '../types/components';
export default function GifModal() {
  const router = useRouter();
  const { close } = useGifACtions();
  const isOpen = useGifVisibility();
  const handleClose = () => {
    close();
    setSearch('');
    router.back();
  };

  const { setSearch } = useGifACtions();
  const { addGifs } = useMediaActions();
  const search = useGifsSearch();
  function handleClickGif(gif: GifData) {
    addGifs(gif);
    handleClose();
  }

  function handleSearchGif(text: string) {
    setSearch(text);
  }
  const { data: gifs, status, error } = useSearchCategories();
  const {
    data: searchGif,
    error: errorGif,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSearchGif();
  console.log(searchGif);
  const pages = searchGif?.pages.flat();

  const renderSearchedGifs = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.map((gif, indx) => (
        <div
          key={gif.id + indx}
          className="relative hover:cursor-pointer w-[200px] h-[200px]"
          onClick={() => handleClickGif(gif)}
        >
          <Image
            priority={true}
            alt={gif.title}
            fill
            src={gif.images.fixed_width_downsampled.url}
            sizes="200px"
            className="object-cover rounded-xl"
          />
        </div>
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].pagination.count > 0 : false;

  return (
    <XModal
      overlayColor="bg-[rgba(91,112,131,0.4)]"
      isOpen={isOpen}
      customLayout={false}
      onClose={handleClose}
      size="3xl"
      padding={false}
    >
      <>
        <div className=" flex p-1">
          <div className="flex justify-center items-center">
            <Icon
              color="text-white"
              path="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"
              onClick={handleClose}
            />
          </div>
          <SearchInput
            value={search}
            onChange={handleSearchGif}
            placeholder="search for GIFs"
            autoFocus={true}
            hover={true}
            clearColor=" bg-text-active"
            hoverColor="hover:bg-text-active/90"
          />
        </div>
        {status === 'error' ? (
          <>
            {toasterMessage(error.message, 'bottom-center', 'error')}
            {router.push('./home')}
          </>
        ) : status === 'pending' ? (
          <Loader />
        ) : search === '' ? (
          <div className="p-1 grid grid-cols-2 gap-1 grid-rows-4  inset-0 py-1 w-full h-full max-h-[650px] ">
            {gifs?.map((gif, indx) => (
              <div
                key={gif.id + indx}
                className=" relative w-full h-full aspect-square hover:cursor-pointer"
                onClick={() => handleSearchGif(CATERGORIES[indx])}
              >
                <Image
                  priority={true}
                  alt={gif.title}
                  src={gif.images.original.url}
                  fill
                  sizes="(min-width:640px) 50vw, 100vw"
                  className="object-cover  rounded-xl"
                  // width={Number(gif.images.fixed_height_small.width)}
                  // height={Number(gif.images.fixed_height_small.height)}
                />
                <span className=" px-2.5 font-bold text-2xl absolute bottom-5 w-3xs h-4">
                  {CATERGORIES[indx]}
                </span>
              </div>
            ))}
          </div>
        ) : isError ? (
          <>
            {toasterMessage(errorGif.message, 'bottom-center', 'error')}
            {router.push('./home')}
          </>
        ) : isLoading ? (
          <div
            className="flex justify-center items-center h-64 mx-4"
            data-testid="tweet-list-loading"
          >
            <Loader />
          </div>
        ) : (
          isLoading !== null &&
          isFetchingNextPage !== null && (
            <>
              <InfiniteScroll
                data-testid="tweet-list"
                isLoadingInitial={isLoading}
                isLoadingMore={isFetchingNextPage}
                loadMore={() => hasNextPage && fetchNextPage()}
                hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
                hasInitialData={hasInitialData}
              >
                <div
                  className="flex flex-wrap gap-2 w-full"
                  data-testid="render-gif-list"
                >
                  {renderSearchedGifs}
                </div>
              </InfiniteScroll>
            </>
          )
        )}
      </>
    </XModal>
  );
}
