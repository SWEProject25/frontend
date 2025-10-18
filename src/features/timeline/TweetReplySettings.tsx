'use client';
import { useState } from 'react';
import Icon from '../../componenets/Icon';
import { options } from '@/Data/replyOptions';
import useAddTweetStore from '@/services/useAddTweetStore';
export default function TweetReplySettings() {
  const [replyOption, setReplyOption] = useState(0);
  const isOpenReplySettings = useAddTweetStore(
    (state) => state.isOpenReplySettings
  );
  if (!isOpenReplySettings) return null;
  return (
    <div className="w-full max-h-9 flex flex-1 items-stretch   border-b-1 border-border ">
      <button
        onClick={() => {}} // open model
        className=" h-6 flex items-center justify-center cursor-pointer hover:bg-icon-hover hover:rounded-full text-primary text-sm font-bold pr-3 "
      >
        <Icon
          viewBox={options[replyOption].viewBox}
          height="h-7"
          width="w-7"
          disabled={true}
          size="w-4"
          color="text-primary"
          path={options[replyOption].path}
        />
        <span className="text-center font-bold">
          {options[replyOption].name} can reply
        </span>
      </button>
    </div>
  );
}
