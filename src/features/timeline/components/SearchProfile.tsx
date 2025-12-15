'use client';
import XMenu from '@/components/ui/home/XMenu';
import { SearchInput } from '@/components/ui/input';
import React, { useState, useRef, useEffect } from 'react';
import UserCard from '@/components/ui/UserCard';
import { useSearchHashtag, useSearchProfile } from '../hooks/timelineQueries';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { Loader } from '@/components/generic';
import toasterMessage from '@/components/ui/home/ToasterMessage';
import {
  useSearch,
  useSearchAction,
  useSearchIsopen,
} from '../store/useTimelineStore';

import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/home/Icon';
import useDebounce from '../hooks/useDebounce';

export default function SearchProfile() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(-1);
  const [unFocus, setUnFocus] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const route = usePathname();
  const search = useSearch();
  const { setSearch, setIsOpen } = useSearchAction();
  const isOpen = useSearchIsopen();
  const erase = route === './home';
  const startWithHash = search.trimStart().startsWith('#');
  const startWithMention = search.startsWith('@');
  const isMention = /^[a-zA-Z](?!.*[_.]{2})[a-zA-Z0-9._]+$/.test(
    startWithMention ? search.slice(1) : search
  );
  const validSearch = search.trim() !== '';
  function handleSearch(text: string) {
    setSearch(text);
  }
  function handleFocus() {
    // console.log('focus');
    setUnFocus(false);
    setIsOpen(true);
    setSelectedTab(-1);
  }
  function handleKeyDown(e: React.KeyboardEvent) {
    const startIndx = hasHashtag && !hasSpace ? 0 : !startWithHash ? 1 : 2;

    const endIndx =
      !hasAnySpace && !startWithHash && isMention
        ? totalProfiles + 2
        : totalProfiles + 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedTab((tab) =>
        tab === -1 ? startIndx : tab + 1 > endIndx ? startIndx : tab + 1
      );
      const scrollDown = selectedTab + 1 > endIndx ? -60 * totalProfiles : 60;

      if (selectedTab > 3)
        scrollRef.current?.scrollBy({
          top: scrollDown,
          behavior: 'smooth',
        });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedTab((tab) => (tab - 1 < startIndx ? endIndx : tab - 1));
      const scrollUp = selectedTab - 1 < startIndx ? 60 * totalProfiles : -60;
      if (selectedTab < totalProfiles)
        scrollRef.current?.scrollBy({
          top: scrollUp,
          behavior: 'smooth',
        });
    } else if (e.key === 'Enter') {
      console.log(selectedTab);
      // e.preventDefault();
      let path = '';
      if (selectedTab === -1) {
        // const searchQuery = startWithHash ? '%23' + search.replace('#', '') : search;
        path = `/search?q=${encodeURIComponent(search)}`;
      } else if (selectedTab === 1) {
        //go to search for string
        // setSearchExplore(search);

        path = `/search?q=${search}`;
      } else if (selectedTab === totalProfiles + 2) {
        // go to page with @string

        path = startWithMention ? `./${search.slice(1)}` : `./${search}`;
      } else if (selectedTab === 0 && hasHashtag) {
        // go to hasthag if exist
        // setSearchExplore('#' + search);

        const searchQuery = startWithHash
          ? search.trim().replace('#', '')
          : search.trim();
        console.log(search);
        path = `/search?q=%23${encodeURIComponent(searchQuery)}`;
      } else {
        // go to profile number selectedTab -1
        console.log('path');
        if (pages) {
          const limit = pages[0].metadata.limit;
          const page = Math.floor((selectedTab - 2) / limit);
          const index = (selectedTab - 2) % limit;
          const profile = pages[page].data[index];

          path = `/${profile.User.username}`;
          console.log(path);
        }
      }
      if (erase) setSearch('');
      if (validSearch) router.push(path);
      setIsOpen(false);
      setUnFocus(true);
    }
  }
  const hasAnySpace = search.includes(' ');
  const hasSpace = search.trimStart().includes(' ');
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: profiles,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSearchProfile(debouncedSearch);
  const totalProfiles = profiles?.pages[0].metadata.total ?? 0;
  const { data: hashtag } = useSearchHashtag();
  const hashtagPages = hashtag?.pages.flat();
  const hasHashtag = hashtagPages
    ? hashtagPages[0].data.posts.length > 0
    : false;

  const pages = profiles?.pages.flat();

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
  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      if (search) {
        event.preventDefault();
        return '';
      }
    };
    if (route === '/home')
      window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [search, route]);

  const renderProfiles = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.map((profile, indx) => (
        <div
          key={profile.id}
          className={`flex w-full ${profile.is_followed_by_me ? 'h-20' : ' h-16'} p-3 ${selectedTab === i * group.metadata.limit + (indx + 2) && 'bg-white/12'} hover:cursor-pointer hover:bg-white/12`}
          onClick={() => {
            setIsOpen(false);
            if (erase) setSearch('');

            router.push(`/${profile.User.username}`);
          }}
        >
          <UserCard
            name={profile.name}
            userId={profile.id}
            handle={'@' + profile.User.username}
            verified={profile.User.is_verified}
            isFollowed={profile.is_followed_by_me}
            fontSize="text-base"
          ></UserCard>
        </div>
      ))}
    </React.Fragment>
  ));

  const hasInitialData = pages ? pages[0].data.length > 0 : false;

  return (
    <div className="  w-full h-full flex flex-1 relative" ref={divRef}>
      <SearchInput
        unFocus={unFocus}
        value={search}
        onChange={handleSearch}
        className="bg-background"
        onFocus={handleFocus}
        placeholder="Search"
        hover={true}
        clearColor=" bg-text-active"
        hoverColor="hover:bg-text-active/90"
        spellCheck={false}
        handleKeyDown={handleKeyDown}
      />
      {isOpen && (
        <div
          ref={scrollRef}
          className="z-50 bg-background border-border border shadow-[0_0_20px_rgba(255,255,255,0.15)] rounded-2xl absolute top-12 left-0 right-0 flex flex-col max-h-[500px] min-h-[200px]  overflow-y-scroll"
        >
          {search === '' ? (
            <span className="w-full p-2 flex flex-1 text-center text-xl text-text-secondary justify-center items-center">
              Try searching for people, lists, or keywords
            </span>
          ) : isError ? (
            <>{toasterMessage(error.message, 'bottom-center', 'error')}</>
          ) : isLoading ? (
            <div
              className="flex justify-center items-center w-full h-full min-h-[200px]"
              data-testid="tweet-list-loading"
            >
              <Loader />
            </div>
          ) : (
            // <>
            <div
              className="flex flex-col w-full  "
              data-testid="render-search-profile-list"
            >
              {
                // for just testing but i will show only hashtag if they exist in
                //final
              }
              {!hasSpace && hasHashtag && (
                <div
                  className={`flex w-full h-16 items-center gap-x-2 p-3 py-6 border-b  border-border ${hasHashtag && 'hover:cursor-pointer hover:bg-white/12'} ${selectedTab === 0 && 'bg-white/12'}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (erase) setSearch('');
                    const searchQuery = startWithHash
                      ? search.trim().replace('#', '')
                      : search.trim();

                    router.push(`/search?q=%23${searchQuery}`);
                  }}
                >
                  {
                    // hasHashtag ?
                    <>
                      <Icon
                        viewBox={21}
                        color="text-white"
                        hoverColor="text-white"
                        path="M9.094 3.095c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.97-.001-8.999-4.03-9-9z"
                      />
                      <span className="font-semibold text-xl break-all flex-1">
                        {!startWithHash && '#'}
                        {search.trimStart()}
                      </span>
                    </>
                    // : (
                    //   <span className="font-semibold text-xl break-all">
                    //     there is no hashtag with #{searchUser}
                    //   </span>
                    // )
                  }
                </div>
              )}
              {!startWithHash && validSearch && (
                <div
                  className={`flex w-full h-16 items-center gap-x-2 p-3 py-6 border-b  border-border hover:cursor-pointer hover:bg-white/12 ${selectedTab === 1 && 'bg-white/12'}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (erase) setSearch('');

                    router.push(`/search?q=${search}`);
                  }}
                >
                  <Icon
                    viewBox={21}
                    color="text-white"
                    hoverColor="text-white"
                    path="M9.094 3.095c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.155-.67 4.243-1.757 1.087-1.088 1.757-2.586 1.757-4.243 0-3.314-2.686-6-6-6zm-9 6c0-4.971 4.029-9 9-9s9 4.029 9 9c0 1.943-.617 3.744-1.664 5.215l4.475 4.474-2.122 2.122-4.474-4.475c-1.471 1.047-3.272 1.664-5.215 1.664-4.97-.001-8.999-4.03-9-9z"
                  />
                  <span className="font-semibold text-xl break-all flex-1">
                    {search}
                  </span>
                </div>
              )}
              <InfiniteScroll
                data-testid="search-profile-list"
                isLoadingInitial={isLoading}
                isLoadingMore={isFetchingNextPage}
                loadMore={() => hasNextPage && fetchNextPage()}
                hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
                hasInitialData={hasInitialData}
                noDataMessage="no such profile"
                noMoreDataMessage="no more profiles"
              >
                {renderProfiles}
              </InfiniteScroll>
              {!hasAnySpace && !startWithHash && isMention && (
                <div
                  className={`flex w-full h-16 items-center gap-x-2 p-3 py-6 border-t  border-border hover:cursor-pointer hover:bg-white/12  ${selectedTab === totalProfiles + 2 && 'bg-white/12'}`}
                  onClick={() => {
                    setIsOpen(false);
                    if (erase) setSearch('');

                    router.push(`/${search}`);
                  }}
                >
                  <span className="font-semibold text-base break-all flex-1">
                    Go to {!startWithMention && '@'}
                    {search}
                  </span>
                </div>
              )}
            </div>
            // </>
          )}
        </div>
      )}
    </div>
  );
}
