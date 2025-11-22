'use client';
import React from 'react';

import Icon from '../../../components/ui/home/Icon';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import XMenu from '@/components/ui/home/XMenu';

import { onClose } from '@/components/ui/home/XMenu';
import { options } from '../constants/replySettingsOptions';
import { REPLY_MENU } from '../constants/menuName';

const PANEL_HEIGHT = 332;

export default function TweetReplySettings() {
  const selectedReplyOption = useAddTweetStore(
    (state) => state.selectedReplyOption
  );
  const updateReplyOption = useAddTweetStore(
    (state) => state.updateReplyOption
  );

  if (!selectedReplyOption) return null;
  return (
    <div
      data-testid="tweet-reply-settings"
      className="select-text w-full max-h-9 pb-3 flex flex-1 items-stretch   border-b-1 border-border "
    >
      <XMenu>
        <XMenu.Button name={REPLY_MENU} panelHeight={PANEL_HEIGHT}>
          <div
            data-testid="tweet-reply-settings-button"
            className=" h-6 flex items-center justify-center cursor-pointer hover:bg-icon-hover hover:rounded-full text-primary text-sm font-bold pr-3 "
          >
            <Icon
              viewBox={options[selectedReplyOption - 1].viewBox}
              height="h-7"
              width="w-7"
              disabled={true}
              size="w-4"
              color="text-primary"
              path={options[selectedReplyOption - 1].path}
            />
            <span className="text-center font-bold">
              {options[selectedReplyOption - 1].value} can reply
            </span>
          </div>
        </XMenu.Button>
        <XMenu.List
          height="h-[332px]"
          width="w-80"
          name="ReplyMenu"
          preventScroll={false}
        >
          <div
            className="flex  flex-col pt-4 pb-2"
            data-testid="reply-menu-list"
          >
            <div className="px-4 pb-3">
              <h3 className="text-sm font-bold text-text-active">
                Who can reply?
              </h3>
              <p className="text-sm text-text-inactive">
                Choose who can reply to this post.
                <br />
                Anyone mentioned can always reply.
              </p>
            </div>
            <ul className="flex flex-col gap-1 pb-1 ">
              {options.map((opt) => {
                const selected = opt.id === selectedReplyOption;
                return (
                  <li key={opt.value}>
                    <button
                      data-testid={`reply-option-${opt.value.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => {
                        updateReplyOption(opt.id);
                        onClose();
                      }}
                      className="cursor-pointer w-full flex items-center gap-3 px-2 py-2  rounded-sm  hover:bg-white/10 focus:bg-white/10 outline-none"
                    >
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                        <Icon
                          disabled={true}
                          path={opt.path}
                          viewBox={opt.viewBox}
                          color="text-white"
                        />
                      </span>
                      <span className="flex-1 text-left text-sm font-bold text-text-active">
                        {opt.value}
                      </span>
                      {selected && (
                        <span className="text-primary">
                          <Icon path="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </XMenu.List>
      </XMenu>
    </div>
  );
}
