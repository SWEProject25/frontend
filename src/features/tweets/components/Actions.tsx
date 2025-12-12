'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Action from './Action';
import { LikeIconFilled } from '@/components/ui/icons/UIIcons';
import { ACTIONS_META } from '../constants';
import {
  useToggleLikeTweet,
  useToggleRepostTweet,
} from '@/features/tweets/hooks/tweetQueries';
import DropDown from './DropDown';
import {
  getRepostDropdownItems,
  getShareDropdownItems,
} from '../constants/dropdown';
import XModal from '@/components/ui/hoc/XModal';
import AddReply from './AddReply';
import SharePostModal from './SharePostModal';
import AddQuote from './AddQuote';
import { toast } from 'react-hot-toast';
import useAddTweetStore from '@/features/timeline/store/useAddTweetStore';
import { ADD_TWEET } from '@/features/timeline/constants/tweetConstants';
import { useReplyQuoteActions } from '@/features/timeline/store/useAddReplyQuoteStore';
type stats = {
  postId: number;
  isRepost: boolean;
  isQuote: boolean;
  userId: number;
  type?: string;
  parentId?: number;
  likesCount: number;
  retweetsCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isRepostedByMe: boolean;
};

export default function Actions({
  stats,
  onOpened,
  modalClick,
}: {
  stats: stats;
  onOpened?: (opened: boolean) => void;
  modalClick?: () => void;
}) {
  const router = useRouter();
  const setPostType = useAddTweetStore((state) => state.actions.setPostType);
  const { setParentId } = useReplyQuoteActions();
  const { clear } = useReplyQuoteActions();

  const shareDropdownItems = getShareDropdownItems();
  const repostDropdownItems = getRepostDropdownItems({
    isRepostedByMe: stats.isRepostedByMe,
  });
  const actionsMeta = ACTIONS_META({
    isRepostedByMe: stats.isRepostedByMe,
    isLikedByMe: stats.isLikedByMe,
  });
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const toggleLikeTweet = useToggleLikeTweet(
    stats.postId,
    stats.isRepost,
    stats.isQuote,
    stats.userId,
    stats.parentId,
    stats.type
  );
  const toggleRepostTweet = useToggleRepostTweet(
    stats.postId,
    stats.isRepost,
    stats.isQuote,
    stats.userId,
    stats.parentId,
    stats.type
  );
  function handleLike() {
    toggleLikeTweet.mutate(undefined, {
      onError: (error: any) => {
        toast.error('Sorry, that post has been deleted', {
          duration: 3000,
          position: 'bottom-center',
        });
        console.error(error);
      },
    });
  }
  function handleRetweet() {
    toggleRepostTweet.mutate(undefined, {
      onError: (error: any) => {
        toast.error('Sorry, that post has been deleted', {
          duration: 3000,
          position: 'bottom-center',
        });
      },
    });
  }
  function handleLikeCountClick() {
    if (stats.likesCount > 0) {
      router.push(`/home/${stats.postId}/likers`);
    }
  }
  function handleRetweetCountClick() {
    if (stats.retweetsCount > 0) {
      router.push(`/home/${stats.postId}/reposters`);
    }
  }
  function onSelect(key: string) {
    switch (key) {
      case 'copy_link':
        const link = `https://hankers.tech/home/${stats.postId}`;
        navigator.clipboard.writeText(link);
        break;
      case 'send_via_message':
        setShowShareModal(true);
        break;
      case 'repost':
        handleRetweet();
        break;
      case 'quote_post':
        setPostType(ADD_TWEET.QUOTE);
        setParentId(stats.postId);
        setIsQuoteOpen(true);

        if (modalClick) modalClick();
        break;
      default:
        break;
    }
  }
  return (
    <div className="w-full my-.5 relative" data-testid="tweet-actions">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-between items-center w-full mt-3 text-gray-500 text-sm"
      >
        <>
          <Action
            icon={actionsMeta[0].icon}
            count={stats.commentsCount !== undefined ? stats.commentsCount : 0}
            label={actionsMeta[0].label}
            color={actionsMeta[0].color}
            onClick={() => {
              setPostType(ADD_TWEET.REPLY);
              console.log(stats.postId);
              setParentId(stats.postId);
              setIsReplyOpen(true);
              if (modalClick) modalClick();
            }}
          />
          <XModal
            isOpen={isReplyOpen}
            onClose={() => {
              setIsReplyOpen(false);
              setPostType(ADD_TWEET.POST);
              clear();
            }}
            size="xl"
            title="Add Reply"
            showCloseButton={true}
            showLogo={false}
          >
            <AddReply />
          </XModal>
        </>
        <DropDown
          items={repostDropdownItems}
          onOpened={onOpened}
          onSelect={onSelect}
        >
          <Action
            icon={actionsMeta[1].icon}
            count={stats.retweetsCount}
            label={actionsMeta[1].label}
            color={actionsMeta[1].color}
            isColored={stats.isRepostedByMe}
            onCountClick={handleRetweetCountClick}
            stopPropagation={false}
          />
        </DropDown>
        <XModal
          isOpen={isQuoteOpen}
          onClose={() => {
            setPostType(ADD_TWEET.POST);
            clear();
            setIsQuoteOpen(false);
          }}
          size="xl"
          title="Add Quote"
          showCloseButton={true}
          showLogo={false}
        >
          <AddQuote />
        </XModal>
        <Action
          icon={
            stats.isLikedByMe ? (
              <LikeIconFilled className="w-5 h-5 text-rose-400" />
            ) : (
              actionsMeta[2].icon
            )
          }
          count={stats.likesCount !== undefined ? stats.likesCount : 0}
          label={actionsMeta[2].label}
          color={actionsMeta[2].color}
          onClick={handleLike}
          onCountClick={handleLikeCountClick}
          isColored={stats.isLikedByMe}
        />
        <DropDown
          items={shareDropdownItems}
          onOpened={onOpened}
          onSelect={onSelect}
        >
          <Action
            icon={actionsMeta[3].icon}
            label={actionsMeta[3].label}
            color={actionsMeta[3].color}
            stopPropagation={false}
          />
        </DropDown>
      </div>

      {/* Share Post Modal */}
      <SharePostModal
        show={showShareModal}
        postId={stats.postId}
        postUrl={`https://hankers.tech/home/${stats.postId}`}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
