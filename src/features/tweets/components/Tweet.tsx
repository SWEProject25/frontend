'use client';
import React, { use, useEffect, useRef, useState } from 'react';
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
import { useAuth } from '@/features/authentication/hooks';
import { useDeleteTweet, useGetTweetSummary } from '../hooks/tweetQueries';
import useOnScreen from '@/features/timeline/hooks/useOnScreen';
import { useActions } from '@/features/timeline/store/useTimelineStore';
import { useRealTimeTweets } from '@/features/timeline/hooks/useRealTimeTweets';
import toast from 'react-hot-toast';
export default function Tweet({
  data,
  inProfile = false,
}: {
  data: TimelineFeed;
  inProfile?: boolean;
}) {
  const myId = useAuth().user?.id;
  const myTweet = data.isRepost
    ? data?.originalPostData?.userId === myId
    : data.userId === myId;

  const dataViewd = data.isRepost
    ? data.originalPostData
      ? data.originalPostData
      : data
    : data;

  const TWEET_DROPDOWN_ITEMS = getTweetDropdownItems({
    username: dataViewd.username,
    isFollowed: dataViewd.isFollowedByMe,
    isMuted: dataViewd.isMutedByMe || false,
    isBlocked: dataViewd.isBlockedByMe || false,
    myTweet: myTweet,
  });

  const [Hovered, setHovered] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock' | null>(
    null
  );

  const router = useRouter();
  const {
    followUser,
    unfollowUser,
    muteUser,
    unmuteUser,
    blockUser,
    unblockUser,
    isBlockLoading,
  } = useInteractions();

  const [ref, isVisible] = useOnScreen({ threshold: 0.5 });
  const previousState = useRef<boolean>(false);
  const { addVisibleTweet, removeVisibleTweet } = useActions();
  const { joinPost, leavePost, usePostUpdates } = useRealTimeTweets();
  usePostUpdates(
    previousState ? dataViewd.postId : null,
    data.userId,
    dataViewd.type,
    data.parentId
  );

  useEffect(
    function () {
      if (isVisible) {
        if (!previousState.current) {
          addVisibleTweet(data);
          // console.log(dataViewd.postId, data, 'enter');
          joinPost(dataViewd.postId, (resp) => {
            if (resp?.status === 'success') {
              console.log('Join post response:', resp);
            } else {
              console.warn('Join post response:', resp);
            }
          });
        }
        previousState.current = true;
      } else {
        if (previousState.current) {
          removeVisibleTweet(data);
          // console.log(dataViewd.postId, data, 'leave');
          leavePost(dataViewd.postId, (resp) => {
            if (resp?.status === 'success') {
              console.log('Leave post response:', resp);
            } else {
              console.warn('Leave post response:', resp);
            }
          });
        }
        previousState.current = false;
      }
    },
    [
      isVisible,
      dataViewd.postId,
      data,
      addVisibleTweet,
      removeVisibleTweet,
      joinPost,
      leavePost,
    ]
  );
  // const byMe = userId === dataViewd.userId;
  // const TWEET_DROPDOWN_ITEMS = getTweetDropdownItems({
  //   username: dataViewd.username,
  //   isFollowed: dataViewd.isFollowedByMe,
  //   byMe,
  //   isMuted: dataViewd.isMutedByMe || false,
  // });

  const user = {
    id: dataViewd.userId,
    name: dataViewd?.name,
    username: dataViewd?.username,
    verified: dataViewd?.verified,
    avatar: dataViewd?.avatar,
    isFollowedByMe: dataViewd?.isFollowedByMe,
  };
  const content = {
    text: dataViewd?.text,
    media: dataViewd?.media,
    mentions: dataViewd?.mentions,
  };

  const actionsStats = {
    postId: dataViewd.postId,
    isRepost: data.isRepost,
    isQuote: data.isQuote,
    userId: data.userId,
    likesCount: dataViewd.likesCount,
    type: data.type,
    parentId: data.parentId,
    retweetsCount: dataViewd.retweetsCount,
    commentsCount: dataViewd.commentsCount,
    isLikedByMe: dataViewd.isLikedByMe,
    isFollowedByMe: dataViewd.isFollowedByMe,
    isRepostedByMe: dataViewd.isRepostedByMe,
  };

  const isQuote =
    data.isQuote ||
    (data.isRepost && data.originalPostData?.originalPostData !== undefined);
  const quoteTweetData = data.isQuote
    ? data.originalPostData
    : data.isRepost && data.originalPostData?.originalPostData !== undefined
      ? data.originalPostData.originalPostData
      : undefined;
  const quoteData = quoteTweetData
    ? {
        postId: quoteTweetData.postId,
        userId: quoteTweetData.userId,
        tweetContent: {
          text: quoteTweetData.text,
          media: quoteTweetData.media,
          mentions: quoteTweetData.mentions || [],
        },
        avatar: quoteTweetData.avatar ?? null,
        name: quoteTweetData.name,
        username: quoteTweetData.username,
        isVerified: quoteTweetData.verified ?? false,
        date: quoteTweetData.date,
        isDeleted: quoteTweetData.isDeleted || false,
      }
    : undefined;

  const deleteTweetMutation = useDeleteTweet(
    dataViewd.postId,
    actionsStats.isRepost,
    actionsStats.userId,
    actionsStats.parentId,
    actionsStats.type
  );
  const handleDropdownAction = async (key: string) => {
    switch (key) {
      case 'follow':
        if (data.isFollowedByMe) {
          await unfollowUser(dataViewd.userId);
        } else {
          await followUser(dataViewd.userId);
        }
        break;
      case 'mute':
        if (data.isMutedByMe) {
          await unmuteUser(dataViewd.userId);
        } else {
          await muteUser(dataViewd.userId);
        }
        break;
      case 'block':
        setBlockAction('block');
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
    } catch (error) {
      // Handle error, optionally show error notification
      toast.error('This tweet has already been deleted before.', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#2e7ad6ff',
          color: '#FFFFFF',
        },
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };
  const handleConfirmBlock = async () => {
    if (blockAction === 'block') {
      await blockUser(dataViewd.userId);
    } else if (blockAction === 'unblock') {
      await unblockUser(dataViewd.userId);
    }
    setShowBlockModal(false);
    setBlockAction(null);
  };

  const setCurrentTweet = useTweetStore((store) => store.setCurrentTweet);
  const setTweetSummary = useTweetStore((store) => store.setTweetSummary);
  const setSummaryOpened = useTweetStore((store) => store.setSummaryOpened);
  const setSummaryTweet = useTweetStore((store) => store.setSummaryTweet);

  const summary = useGetTweetSummary(dataViewd.postId);
  function handleFetchSummary() {
    if (!dataViewd?.text) {
      setTweetSummary('No summary available');
      setSummaryOpened(true);
      setSummaryTweet(dataViewd);
      return;
    }
    summary.refetch().then((res) => {
      if (res?.data) {
        setTweetSummary(res.data.data);
        setSummaryOpened(true);
        setSummaryTweet(dataViewd);
      } else {
        setTweetSummary('No summary available');
        setSummaryOpened(true);
        setSummaryTweet(dataViewd);
      }
    });
  }

  return (
    <div
      ref={ref}
      data-testid={`tweet-${dataViewd.postId}`}
      onClick={() => {
        //setCurrentTweet(data);
        router.push(`/home/${dataViewd.postId}`);
      }}
      className={`block mx-auto w-full border-b border-gray-700 text-white relative transition-colors ${!Hovered ? 'hover:bg-[#0a0a0a]' : ''} hover:cursor-pointer p-4`}
      style={{ boxSizing: 'border-box', maxWidth: '100%' }}
    >
      {/* Show reposted by if present */}
      {data.isRepost && (
        <div className="flex items-center text-xs text-gray-400 mb-1 ml-10">
          <span className="mr-1">
            <RetweetIcon />
          </span>
          <span className="font-semibold">
            <Link
              href={`/${data.username}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:underline"
            >
              {myId === data.userId ? 'You reposted' : `${data.name} reposted`}
            </Link>
          </span>
        </div>
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
              {!inProfile && (
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
              )}
            </div>
          </div>
          <Content content={content} isQuote={isQuote} data={quoteData} />
          <Actions
            stats={actionsStats}
            onOpened={setHovered}
            modalClick={() => {
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

//no
