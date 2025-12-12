'use client';
import Icon from '@/components/ui/home/Icon';
import AddTweet from './AddTweet';
import Header from './Header';
import ShowTweets from './ShowTweets';
// import TweetFeed from './TweetFeed';
import TweetList from './TweetList';
import { Avatar } from '@/components/generic';
import {
  useActions,
  useFetchAvatars,
  useNewTweets,
  usePopUpAvatars,
  useSelectedTab,
} from '../store/useTimelineStore';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { TIMELINE_QUERY_KEYS, useAvatarsPopUp } from '../hooks/timelineQueries';
import { FOR_YOU_TAB } from '../constants/menuName';
import { useEffect, useRef } from 'react';
import { TimelineFeedDtoResponse } from '../types/api';

export default function Timeline() {
  const avatars = usePopUpAvatars();
  const queryClient = useQueryClient();
  const selectedTab = useSelectedTab();
  const topRef = useRef<HTMLDivElement | null>(null);
  const queryKey =
    selectedTab === FOR_YOU_TAB
      ? TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOR_YOU
      : TIMELINE_QUERY_KEYS.TIMELINE_FEED_FOLLOWING;
  const { setPopUpAvatars, setFetchAvatars, setNewTweets } = useActions();
  const isPopUpVisible = useFetchAvatars();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const newTweets = useNewTweets();
  const { data, error, isError, isLoading } = useAvatarsPopUp();
  useEffect(
    function () {
      if (data && data.pages[0]?.data?.posts?.length > 0) {
        console.log(data);
        // if (newTweets.length === 0) {
        const posts = data.pages[0].data.posts;
        const images = posts.map((post) =>
          post.isRepost
            ? post.originalPostData
              ? {
                  avatar: post.originalPostData.avatar,
                  name: post.originalPostData.name,
                }
              : {
                  avatar: post.avatar,
                  name: post.name,
                }
            : {
                avatar: post.avatar,
                name: post.name,
              }
        );
        setPopUpAvatars(images);
        setNewTweets(posts);
        // }
      }
    },
    [data, newTweets.length, setNewTweets, setPopUpAvatars]
  );

  useEffect(
    function () {
      const element = topRef.current;
      if (!element) return;

      function handleIntersection(entries: IntersectionObserverEntry[]) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPopUpAvatars([]);
            setFetchAvatars(false);
            setNewTweets([]);
            if (interval.current) {
              clearInterval(interval.current);
              interval.current = null;
            }
          } else {
            if (!interval.current)
              interval.current = setTimeout(
                () => setFetchAvatars(true),
                3000 * 60
              );
          }
        });
      }
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: `${2000}px`,
        threshold: 0,
      });
      observer.observe(element);
      return () => {
        if (element) observer.unobserve(element);
      };
    },

    [setFetchAvatars, setNewTweets, setPopUpAvatars]
  );

  return (
    <div className="flex flex-col min-h-screen " data-testid="timeline">
      <Header />
      <div
        className="flex flex-col justify-items-center full-width relative"
        data-testid="timeline-content"
      >
        <div ref={topRef}>
          <AddTweet />
        </div>
        {/* <ShowTweets /> */}
        {/* <TweetFeed /> */}
        <TweetList />

        {avatars.length > 0 && isPopUpVisible && (
          <div
            className="flex rounded-2xl z-50 items-center p-3 min-w-36 h-12 fixed top-50  left-[45%] -translate-x-1/2  bg-primary cursor-pointer hover:bg-primary-hover shadow-lg"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              queryClient.refetchQueries({ queryKey: queryKey });
              // queryClient.setQueryData<
              //   InfiniteData<TimelineFeedDtoResponse, number>
              // >(queryKey, (old) => {
              //   if (!old) return;
              //   const oldTweets = old.pages[0].data.posts.map(tweet=>{tweet.postId});
              //   const newPosts = newTweets.filter((tweet) =>
              //     oldTweets.includes(tweet)
              //   );
              //   const updated = {
              //     ...old,
              //     pages: old.pages.map((page, ind) => {
              //       if (ind === 0) {
              //         return {
              //           ...page,
              //           data: {
              //             ...page.data,
              //             posts: [...newTweets, ...page.data.posts],
              //           },
              //         };
              //       }
              //       return page;
              //     }),
              //   };

              //   return updated;
              // });
              setPopUpAvatars([]);
              setNewTweets([]);
              setFetchAvatars(false);
            }}
          >
            <Icon
              disabled={true}
              color="text-white"
              path="M12 3.59l7.457 7.45-1.414 1.42L13 7.41V21h-2V7.41l-5.043 5.05-1.414-1.42L12 3.59z"
            />
            <div className="flex items-center -space-x-2">
              {avatars.map((user, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ zIndex: 3 - index }}
                >
                  <Avatar
                    avatarImage={user.avatar}
                    name={user.name}
                    size="xs"
                    position="relative"
                    className="border-1 border-primary-hover"
                  />
                </div>
              ))}
            </div>

            <span className="text-white text-base pl-0.5 "> Posted</span>
          </div>
        )}

        {/* <Tweets /> */}
      </div>
    </div>
  );
}
