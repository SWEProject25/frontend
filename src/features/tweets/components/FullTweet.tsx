'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Content from './Content';
import Actions from './Actions';
import UserInfo from './UserInfo';
import TweetAvatar from './TweetAvatar';
import Action from './Action';
import DropDown from './DropDown';
import Timing from './Timing';
import Tweet from './Tweet';
import Header from './Header';
import { TimelineFeed } from '@/features/timeline/types/api';
import { GrokIcon } from '@/components/ui/icons/BrandIcons';
import { DropIcon } from '@/components/ui/icons/UIIcons';
import { getTweetDropdownItems } from '../constants';
import { useInteractions } from '@/hooks/useInteractions';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';
import Loader from '@/components/generic/Loader';
import {
  useDeleteTweet,
  useGetRepliesByTweetId,
  useGetTweetSummary,
} from '../hooks/tweetQueries';
import InfiniteScroll from '@/components/ui/home/InfiniteScroll';
import { useTweetStore } from '../store/tweetStore';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { useAuth } from '@/features/authentication/hooks';
function FullTweet({ data }: { data: TimelineFeed | null }) {
  const router = useRouter();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock' | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const userId = useAuthStore((store) => store.user?.id);
  const byMe = userId === data?.userId;
  const {
    followUser,
    unfollowUser,
    muteUser,
    unmuteUser,
    blockUser,
    unblockUser,
    isBlockLoading,
  } = useInteractions();
  const myId = useAuth().user?.id;
  const myTweet = data?.isRepost
    ? data?.originalPostData?.userId === myId
    : data?.userId === myId;
  const TWEET_DROPDOWN_ITEMS = getTweetDropdownItems({
    username: data?.username,
    isFollowed: data?.isFollowedByMe,
    isMuted: data?.isMutedByMe || false,
    isBlocked: data?.isBlockedByMe || false,
    myTweet: myTweet,
  });

  // const TWEET_DROPDOWN_ITEMS = getTweetDropdownItems({
  //   username: data?.username || '',
  //   isFollowed: data?.isFollowedByMe || false,
  //   byMe,
  //   isMuted: data?.isMutedByMe || false,
  //   isBlocked: data?.isBlockedByMe || false,
  // });

  const {
    data: repliesResponse,
    error,
    isError,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetRepliesByTweetId(data?.postId || 0);
  const pages = repliesResponse?.pages.flat();
  const renderReplys = pages?.map((group, i) => (
    <React.Fragment key={i}>
      {group.data.posts.map((reply, index) => (
        <Tweet key={index} data={reply} />
      ))}
    </React.Fragment>
  ));
  const deleteTweetMutation = useDeleteTweet(data?.postId || -1);
  const hasInitialData = pages ? pages[0].data.posts.length > 0 : false;

  const handleDropdownAction = async (key: string) => {
    if (!data) return;

    switch (key) {
      case 'follow':
        if (data.isFollowedByMe) {
          await unfollowUser(data.userId);
        } else {
          await followUser(data.userId);
        }
        break;
      case 'mute':
        if (data.isMutedByMe) {
          await unmuteUser(data.userId);
        } else {
          await muteUser(data.userId);
        }
        break;
      case 'block':
        if (data.isBlockedByMe) {
          // Show confirmation modal for unblock
          setBlockAction('unblock');
        } else {
          // Show confirmation modal for block
          setBlockAction('block');
        }
        setShowBlockModal(true);
        break;
      case 'delete':
        // Handle delete action here
        setShowDeleteModal(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await deleteTweetMutation.mutateAsync();
      setShowDeleteModal(false);
      // Optionally, you can add a success notification here
      // Redirect to home after deletion
      router.push('/home');
    } catch (error) {
      // Handle error, optionally show error notification
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const handleConfirmBlock = async () => {
    if (!data) return;

    if (blockAction === 'block') {
      await blockUser(data.userId);
      // Redirect to home after blocking
      router.push('/home');
    } else if (blockAction === 'unblock') {
      await unblockUser(data.userId);
    }
    setShowBlockModal(false);
    setBlockAction(null);
  };
  const summary = useGetTweetSummary(data?.postId || 0);
  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const setTweetSummary = useTweetStore((store) => store.setTweetSummary);
  const setSummaryOpened = useTweetStore((store) => store.setSummaryOpened);
  const setSummaryTweet = useTweetStore((store) => store.setSummaryTweet);
  function handleFetchSummary() {
    if (summary.data) {
      setTweetSummary(summary.data.data);
      setSummaryOpened(true);
      setSummaryTweet(data);
    }
  }
  if (!data) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader />
      </div>
    );
  }
  const user = {
    id: data.userId,
    name: data.name,
    username: data.username,
    verified: data.verified,
    avatar: data.avatar,
  };
  const content = {
    text: data.text,
    media: data.media,
    mentions: data.mentions,
  };

  const quoteData = data.originalPostData
    ? {
        postId: data.originalPostData.postId,
        userId: data.originalPostData.userId,
        tweetContent: {
          text: data.originalPostData.text,
          media: data.originalPostData.media,
          mentions: data.originalPostData.mentions || [],
        },
        avatar: data.originalPostData.avatar ?? null,
        name: data.originalPostData.name,
        username: data.originalPostData.username,
        isVerified: data.originalPostData.verified ?? false,
        date: data.originalPostData.date,
      }
    : undefined;

  const actionsStats = {
    postId: data.postId,
    isRepost: data.isRepost,
    isQuote: data.isQuote,
    userId: data.userId,
    type: data?.type,
    parentId: data?.parentId,

    likesCount: data.likesCount,
    retweetsCount: data.retweetsCount,
    commentsCount: data.commentsCount,
    isLikedByMe: data.isLikedByMe,
    isRepostedByMe: data.isRepostedByMe,
  };
  return (
    <div>
      <Header />
      <div className="mx-auto p-4 text-white relative ">
        <div className="flex items-start justify-between">
          <div className="flex space-x-3">
            <TweetAvatar data={user} />
            <UserInfo data={user} direction="vertical" />
          </div>
          <div className="ml-2 flex items-center space-x-2 text-gray-500">
            <Action
              icon={<GrokIcon />} // smaller icon
              label="Explain this post"
              color="blue"
              onClick={handleFetchSummary}
            />
            <DropDown
              items={TWEET_DROPDOWN_ITEMS}
              onSelect={handleDropdownAction}
            >
              <Action
                icon={<DropIcon />}
                label="more"
                color="blue"
                stopPropagation={false}
              />
            </DropDown>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <Content
            content={content}
            isQuote={data.isQuote}
            data={quoteData}
            fullWidth={true}
          />

          <div className="flex items-center space-x-1">
            <Timing time={data.date} full={true} />
          </div>
          <div className="border-b border-gray-700 my-2" />

          <Actions
            stats={actionsStats}
            replyClick={() => setCurrentTweet(data)}
          />
          <div className="border-b border-gray-700 mt-3" />
        </div>
      </div>
      <div>
        {isError ? (
          <div>Error {error.message}</div>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <InfiniteScroll
              isLoadingInitial={isLoading}
              isLoadingMore={isFetchingNextPage}
              loadMore={() => hasNextPage && fetchNextPage()}
              hasMoreData={hasNextPage && !isFetchingNextPage && !isLoading}
              hasInitialData={hasInitialData}
            >
              <div className="flex flex-col w-full">{renderReplys} </div>
              {/* <ul className="w-full">{renderTweets} </ul> */}
            </InfiniteScroll>
          </>
        )}
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
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete tweet?"
        message="This action cannot be undone. Are you sure you want to delete this tweet?"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleteLoading}
      />
    </div>
  );
}

export default FullTweet;
