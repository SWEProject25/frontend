'use client';
import React from 'react';

interface BlockedByUserNoticeProps {
  username: string;
}

const BlockedByUserNotice: React.FC<BlockedByUserNoticeProps> = ({
  username,
}) => {
  return (
    <div
      className="flex flex-col py-6 px-6 border-t border-border bg-muted/30"
      data-testid="blocked-by-user-notice"
    >
      <div className="max-w-2xl space-y-3">
        <h2
          className="text-xl font-bold text-text-active"
          data-testid="blocked-by-user-title"
        >
          @{username} has blocked you
        </h2>

        <p
          className="text-sm text-text-secondary leading-relaxed"
          data-testid="blocked-by-user-description"
        >
          You can view public posts from @{username}, but you are blocked from
          engaging with them. You also cannot follow or message @{username}.
        </p>
      </div>
    </div>
  );
};

export default BlockedByUserNotice;
