'use client';

import { useSearchProfile } from '../hooks/timelineQueries';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '@/components/ui/UserCard';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import { Loader } from '@/components/generic';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { useAddPostContext } from '../store/AddPostContext';
import useDebounce from '../hooks/useDebounce';
export default function Mention() {
  const selectors = useAddPostContext();
  const mention = selectors.useMention();
  const [selectedTab, setSelectedTab] = useState(-1);

  const { setMention, setIsOpen, setIsDone, setKeyDown } =
    selectors.useActions();
  const currentKey = selectors.useCurrentKey();
  const isOpen = selectors.useIsOpen();

  const debouncedMention = useDebounce(mention, 300);
  const {
    data: profiles,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSearchProfile(debouncedMention);
  console.log(profiles, mention);
  const pages = profiles?.pages.flat();
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(
    function () {
      const totalProfiles = profiles?.pages[0].metadata.total ?? 0;

      function handleKeyDown(key: string) {
        const startIndx = totalProfiles ? 0 : -1;
        if (key === 'ArrowDown') {
          setSelectedTab((tab) =>
            tab + 1 > totalProfiles - 1 ? startIndx : tab + 1
          );
          const scrollDown =
            selectedTab + 1 > totalProfiles - 1 ? -60 * totalProfiles : 60;

          if (selectedTab > 2)
            divRef.current?.scrollBy({
              top: scrollDown,
              behavior: 'smooth',
            });
        } else if (key === 'ArrowUp') {
          setSelectedTab((tab) => (tab - 1 < 0 ? totalProfiles - 1 : tab - 1));
          const scrollUp =
            selectedTab - 1 < startIndx ? 60 * totalProfiles : -60;
          if (selectedTab < totalProfiles)
            divRef.current?.scrollBy({
              top: scrollUp,
              behavior: 'smooth',
            });
        }
        if (key === 'Enter') {
          if (selectedTab === -1) {
            if (totalProfiles && pages) {
              //   setMention(pages[0].data[0].User.username + '');
              setIsDone(
                pages[0].data[0].User.username + ' ' + pages[0].data[0].user_id
              );

              console.log(pages[0].data[0].User.username);
              //set username with first one
            }
          } else {
            if (pages) {
              const limit = pages[0].metadata.limit;
              console.log(limit);
              const index = selectedTab % limit;
              const page = Math.floor(selectedTab / limit);
              console.log(page, index, selectedTab);
              const profile = pages[page].data[index];
              console.log(profile);
              //   setMention(profile.User.username + '');
              console.log(profile.User.username + ' ' + profile.user_id);
              setIsDone(profile.User.username + ' ' + profile.user_id);
              console.log(profile.User.username);
              // set user name with profile
            }
          }
          setIsOpen(false);
          //   setIsDone(true);
        } else {
          if (key === 'reset') {
            setSelectedTab(-1);
          }
        }
      }
      handleKeyDown(currentKey);
      setKeyDown('');
      console.log(currentKey);
    },
    [currentKey, setKeyDown, profiles, pages]
  );
  useEffect(
    function () {
      function handleCloseSearch(e: MouseEvent) {
        if (
          divRef.current &&
          e.target instanceof Node &&
          !divRef.current.contains(e.target)
        )
          setIsOpen(false);
      }
      document.addEventListener('mousedown', handleCloseSearch);
      return () => document.removeEventListener('mousedown', handleCloseSearch);
    },
    [setIsOpen]
  );

  const renderProfiles = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.map((profile, indx) => (
        <div
          key={profile.user_id}
          className={`flex w-full  ${profile.is_followed_by_me ? 'h-20' : ' h-16'} p-3 ${selectedTab === i * group.metadata.limit + indx && 'bg-white/12'} hover:cursor-pointer hover:bg-white/12`}
          // className={`flex w-full ${profile.is_followed_by_me ? 'h-20' : ' h-16'} p-3  hover:cursor-pointer hover:bg-white/12`}
          onClick={() => {
            // setMention(profile.User.username + '');
            console.log(profile.User.username);
            setIsOpen(false);
            // setIsDone(true);
            setIsDone(profile.User.username + ' ' + profile.user_id);
          }}
          // onKeyDown={(e: React.KeyboardEvent) => {
          //   e.preventDefault();
          //   handleKeyDown(e.key);
          // }}
        >
          <UserCard
            name={profile.name}
            userId={profile.user_id}
            handle={'@' + profile.User.username}
            verified={profile.User.is_verified}
            isFollowed={profile.is_followed_by_me}
            fontSize="text-base"
            avatarUrl={profile.profile_image_url}
          ></UserCard>
        </div>
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.length > 0 : false;

  if (!isOpen) return;
  if (!mention) return;
  return (
    <div
      ref={divRef}
      className=" w-full z-50 mt-0.5 bg-background border-border border shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl absolute  left-6 right-0 flex flex-col max-h-[320px] min-h-[200px] max-w-[380px] overflow-y-scroll"
    >
      {isError ? (
        <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
      ) : isLoading ? (
        <div
          className="flex justify-center items-center w-full h-full min-h-[200px]"
          data-testid="tweet-list-loading"
        >
          <Loader />
        </div>
      ) : (
        <div
          className="flex flex-col w-full  "
          data-testid="render-search-profile-list"
        >
          <InfiniteScroll
            data-testid="search-profile-list"
            isLoadingInitial={isLoading}
            isLoadingMore={isFetchingNextPage}
            loadMore={() => hasNextPage && fetchNextPage()}
            hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
            hasInitialData={hasInitialData}
            noDataMessage="no such profile"
            // noMoreDataMessage="no more profiles"
            // showNoMoreData={false}
            noMoreDataMessage=""
          >
            {renderProfiles}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
