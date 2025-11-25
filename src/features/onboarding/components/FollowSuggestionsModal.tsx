'use client';

import React, { useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import { AuthButton } from '@/components/ui/AuthButton';
import UserCard from '@/components/ui/UserCard';
import { useSuggestedUsers } from '../hooks/useOnboarding';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { authApi } from '@/features/authentication/services/authApi';

interface FollowSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function FollowSuggestionsModal({
  isOpen,
  onClose,
  onComplete,
}: FollowSuggestionsModalProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  // Fetch suggested users with pagination params - only when modal is open
  const {
    data: suggestedUsersData,
    isLoading,
    error,
  } = useSuggestedUsers(
    {
      limit: 10,
      excludeFollowed: true,
      excludeBlocked: true,
    },
    isOpen // Only fetch when modal is open
  );

  const handleNext = () => {
    if (user && followedUsers.size > 0) {
      // Mark following step as complete
      setUser({
        ...user,
        onboardingStatus: {
          ...user.onboardingStatus,
          hasCompletedBirthDate:
            user.onboardingStatus?.hasCompletedBirthDate ?? false,
          hasCompeletedInterests:
            user.onboardingStatus?.hasCompeletedInterests ?? false,
          hasCompeletedFollowing: true,
        },
      });
      // Clear the cached user to force fresh fetch on next getCurrentUser call
      authApi.clearUserCache();
      onComplete();
    }
  };

  const handleFollowChange = (userId: number, isFollowed: boolean) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (isFollowed) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  const suggestedUsers = suggestedUsersData?.data?.users || [];
  const totalAvailable = suggestedUsersData?.total || 0;

  return (
    <XModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      closeOnOverlayClick={false}
      closeOnEscape={false}
      showLogo
      customLayout
      title=""
    >
      <div className="flex flex-col h-full max-h-[700px]">
        {/* Header */}
        <div className="px-8 pt-5 pb-8">
          <h2 className="text-[31px] font-bold text-foreground mb-2 leading-9">
            Don&apos;t miss out
          </h2>
          <p className="text-text-inactive text-[15px] leading-5">
            When you follow someone, you&apos;ll see their posts in your
            Timeline. You&apos;ll also get more relevant recommendations.
          </p>
        </div>

        {/* Subheading */}
        <div className="px-8 pb-3">
          <h3 className="text-[20px] font-bold text-foreground leading-6">
            Follow 1 or more accounts
            {totalAvailable > 0 && (
              <span className="text-text-inactive font-normal text-[13px] ml-2">
                ({suggestedUsers.length} of {totalAvailable} shown)
              </span>
            )}
          </h3>
        </div>

        {/* Users List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-3 text-text-inactive">Loading suggestions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-error">
              <p>Failed to load suggestions</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          ) : suggestedUsers.length > 0 ? (
            <div className="space-y-2 pb-4">
              {suggestedUsers.map((suggestedUser) => {
                const isFollowing = followedUsers.has(suggestedUser.id);

                return (
                  <div
                    key={suggestedUser.id}
                    className="py-2 px-2 transition-colors hover:bg-muted/20 rounded-lg"
                  >
                    <UserCard
                      name={
                        suggestedUser.profile?.name ?? suggestedUser.username
                      }
                      userId={suggestedUser.id}
                      handle={`@${suggestedUser.username}`}
                      verified={suggestedUser.isVerified}
                      avatarUrl={
                        suggestedUser.profile?.profileImageUrl || undefined
                      }
                      bio={suggestedUser.profile?.bio || undefined}
                      isFollowed={isFollowing}
                      actionType="follow"
                      onFollowChange={handleFollowChange}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-text-inactive">
              <p>No suggestions available at the moment.</p>
            </div>
          )}
        </div>

        {/* Footer with button */}
        <div className="px-8 py-5 border-t border-border">
          <AuthButton
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleNext}
            disabled={followedUsers.size === 0}
          >
            Next
          </AuthButton>
        </div>
      </div>
    </XModal>
  );
}
