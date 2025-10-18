'use client';
import useAddTweetStore from '@/services/useAddTweetStore';
import { useEffect, useRef } from 'react';

export default function TweetText() {
  const tweetText = useAddTweetStore((state) => state.tweetText);
  const setTweetText = useAddTweetStore((state) => state.setTweetText);
  const ref = useRef<null | HTMLTextAreaElement>(null);
  const isOpenReplySettings = useAddTweetStore(
    (state) => state.isOpenReplySettings
  );
  function handleText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (ref.current) {
      ref.current.style.height = `auto`;
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }

    setTweetText(e.target.value);
  }

  useEffect(
    function () {
      if (isOpenReplySettings) ref.current?.focus();
    },
    [isOpenReplySettings]
  );

  return (
    <div className="  relative flex flex-1 items-center py-3 h-fit ">
      <textarea
        ref={ref}
        value={tweetText}
        maxLength={280}
        rows={1}
        cols={40}
        onChange={handleText}
        className={` flex flex-1  items-stretch overflow-y-hidden resize-none text-xl border-0 h-fit pl-2 pr-4 focus:outline-0  w-[25rem] md:w-[32rem] transition-[height] duration-100 ease-in-out `}
        id="1"
        wrap="soft"
        placeholder="What's happening?"
      ></textarea>
    </div>
  );
}
