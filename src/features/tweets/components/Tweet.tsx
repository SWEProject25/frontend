'use client';
import React, { useState } from 'react';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import TweetAvatar from './TweetAvatar';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';
import { useRouter } from 'next/navigation';
import { TimelineFeed, TimelineTweet } from '@/features/timeline/types/api';
import { useTweetStore } from '../store/tweetStore';
import { DropIcon, RetweetIcon } from '@/components/ui/icons/UIIcons';
import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import { getTweetDropdownItems } from '../constants';
import { useInteractions } from '@/hooks/useInteractions';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';
import Link from 'next/link';
import { useDeleteTweet, useGetTweetSummary } from '../hooks/tweetQueries';
import { useAuthStore } from '@/features/authentication/store/authStore';
export default function Tweet({ data }: { data: TimelineFeed }) {
  const userId = useAuthStore((store) => store.user?.id);
  const byMe = userId === data.userId;
  const TWEET_DROPDOWN_ITEMS = getTweetDropdownItems({
    username: data.username,
    isFollowed: data.isFollowedByMe,
    byMe,
  });

  const [Hovered, setHovered] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock' | null>(
    null
  );

  const router = useRouter();
  const {
    followUser,
    unfollowUser,
    muteUser,
    blockUser,
    unblockUser,
    isBlockLoading,
  } = useInteractions();

  const dataViewd = data.isRepost
    ? data.originalPostData
      ? data.originalPostData
      : data
    : data;

  const user = {
    id: data.userId,
    name: dataViewd?.name,
    username: dataViewd?.username,
    verified: dataViewd?.verified,
    avatar: dataViewd?.avatar,
    isFollowedByMe: dataViewd?.isFollowedByMe,
  };
  const content = {
    text: dataViewd?.text,
    media: dataViewd?.media,
  };

  const actionsStats = {
    postId: dataViewd?.postId,
    isRepost: data.isRepost,
    isQuote: data.isQuote,
    userId: data.userId,
    likesCount: data.likesCount,
    type: data.type,
    parentId: data.parentId,
    retweetsCount: data.retweetsCount,
    commentsCount: data.commentsCount,
    isLikedByMe: data.isLikedByMe,
    isFollowedByMe: data.isFollowedByMe,
    isRepostedByMe: data.isRepostedByMe,
  };

  const summary = useGetTweetSummary(data.postId);
  const deleteTweetMutation = useDeleteTweet(data.postId);
  const handleDropdownAction = async (key: string) => {
    switch (key) {
      case 'follow':
        if (data.isFollowedByMe) {
          await unfollowUser(data.userId);
        } else {
          await followUser(data.userId);
        }
        break;
      case 'mute':
        await muteUser(data.userId);
        break;
      case 'block':
        setBlockAction('block');
        setShowBlockModal(true);
        break;
      case 'delete':
        // Handle delete action here
        console.log('Delete action selected for tweet:', data.postId);
        deleteTweetMutation.mutate();
        break;
      default:
        console.log('Selected item key:', key);
        break;
    }
  };

  const handleConfirmBlock = async () => {
    if (blockAction === 'block') {
      await blockUser(data.userId);
    } else if (blockAction === 'unblock') {
      await unblockUser(data.userId);
    }
    setShowBlockModal(false);
    setBlockAction(null);
  };

  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const setTweetSummary = useTweetStore((store) => store.setTweetSummary);
  const setSummaryOpened = useTweetStore((store) => store.setSummaryOpened);
  const setSummaryTweet = useTweetStore((store) => store.setSummaryTweet);
  function handleFetchSummary() {
    if (summary.data) {
      setTweetSummary(summary.data.data);
      setSummaryOpened(true);
      setSummaryTweet(dataViewd);
    }
  }

  return (
    <div
      data-testid={`tweet-${data.postId}`}
      onClick={() => {
        //setCurrentTweet(data);
        console.log('tweet:', data);
        router.push(`/home/${data.postId}`);
      }}
      className={`block mx-auto w-full border-b border-gray-700 text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0a0a0a]' : ''} hover:cursor-pointer p-4`}
      style={{ boxSizing: 'border-box', maxWidth: '100%' }}
    >
      {/* Show reposted by if present */}
      {data.isRepost && (
        <Link
          href={`/${data.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center text-xs text-gray-400 mb-1 ml-10 hover:underline"
        >
          <span className="mr-1">
            <RetweetIcon />
          </span>
          <span className="font-semibold">
            <span>{data.name} </span>
            reposted
          </span>
        </Link>
      )}
      <div className="flex w-full gap-2">
        <TweetAvatar data={user} onHoverCard={setHovered} />
        <div
          className="flex flex-col items-center flex-1"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          <div
            className="flex items-center justify-between w-full"
            data-testid="tweet-header"
            style={{ maxWidth: '100%' }}
          >
            <div className="flex items-center gap-1">
              <UserInfo data={user} onHoverCard={setHovered} />
              <span className="text-gray-500">.</span>
              <Timing time={data.date} />
            </div>
            <div
              className="ml-2 flex items-center space-x-2 text-gray-500"
              data-testid="tweet-actions-header"
            >
              <Action
                icon={<GrokIcon />} // smaller icon
                label="Explain this post"
                color="blue"
                onClick={() => {
                  handleFetchSummary();
                }}
              />
              <DropDown
                items={TWEET_DROPDOWN_ITEMS}
                onOpened={setHovered}
                onSelect={handleDropdownAction}
              >
                <Action
                  icon={<DropIcon />} // smaller icon
                  label="more"
                  color="blue"
                  stopPropagation={false}
                />
              </DropDown>
            </div>
          </div>
          <Content content={content} />
          <Actions
            stats={actionsStats}
            onOpened={setHovered}
            replyClick={() => {
              setCurrentTweet(data);
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showBlockModal}
        onClose={() => {
          setShowBlockModal(false);
          setBlockAction(null);
        }}
        onConfirm={handleConfirmBlock}
        title={blockAction === 'block' ? 'Block user?' : 'Unblock user?'}
        message={
          blockAction === 'block'
            ? `They will not be able to follow you or view your posts, and you will not see posts or notifications from @${data.username}.`
            : `@${data.username} will be able to follow you and view your posts again.`
        }
        confirmText={blockAction === 'block' ? 'Block' : 'Unblock'}
        cancelText="Cancel"
        confirmButtonClass="bg-block hover:bg-block/90 text-white"
        isLoading={isBlockLoading}
      />
    </div>
  );
}
