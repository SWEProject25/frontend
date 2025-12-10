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
  replyClick,
}: {
  stats: stats;
  onOpened?: (opened: boolean) => void;
  replyClick?: () => void;
}) {
  const router = useRouter();
  const shareDropdownItems = getShareDropdownItems();
  const repostDropdownItems = getRepostDropdownItems({
    isRepostedByMe: stats.isRepostedByMe,
  });
  const actionsMeta = ACTIONS_META({
    isRepostedByMe: stats.isRepostedByMe,
    isLikedByMe: stats.isLikedByMe,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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
    toggleLikeTweet.mutate();
  }
  function handleRetweet() {
    toggleRepostTweet.mutate();
  }
  function handleLikeCountClick() {
    if (stats.likesCount > 0) {
      router.push(`/home/${stats.postId}/likers`);
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
        // Implement quote post functionality here
        break;
      default:
        break;
    }
  }
  return (
    <div className="w-full my-.5 relative" data-testid="tweet-actions">
      <div className="flex justify-between items-center w-full mt-3 text-gray-500 text-sm">
        <>
          <Action
            icon={actionsMeta[0].icon}
            count={stats.commentsCount !== undefined ? stats.commentsCount : 0}
            label={actionsMeta[0].label}
            color={actionsMeta[0].color}
            onClick={() => {
              setIsOpen(true);
              if (replyClick) replyClick();
            }}
          />
          <XModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
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
            stopPropagation={false}
          />
        </DropDown>
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
